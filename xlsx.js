/* Mini lector/escritor de Excel (.xlsx) sin dependencias externas.
   XLSX.escribir(hojas, nombreArchivo)  → descarga el archivo
     hojas = [{ nombre, columnas:[{t:'Título', w:20}], filas:[[...], ...] }]
   XLSX.leer(file) → Promise<{ NombreHoja: [[celda,...],...] }>  */
(function () {
  const enc = new TextEncoder();
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  const col = n => { let s = ''; n++; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };

  function zip(files) {
    const parts = [], central = []; let off = 0;
    files.forEach(f => {
      const name = enc.encode(f.name), data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
      parts.push(new Uint8Array(h.buffer), name, data);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
      c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
      central.push(new Uint8Array(c.buffer), name);
      off += 30 + name.length + data.length;
    });
    const csize = central.reduce((a, b) => a + b.length, 0);
    const e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csize, true); e.setUint32(16, off, true);
    return new Blob(parts.concat(central, [new Uint8Array(e.buffer)]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  function hoja(h) {
    const cols = h.columnas.map((c, i) => `<col min="${i + 1}" max="${i + 1}" width="${c.w || 18}" customWidth="1"/>`).join('');
    const rows = [h.columnas.map(c => c.t)].concat(h.filas).map((f, r) => `<row r="${r + 1}">` + f.map((v, c) => {
      const ref = col(c) + (r + 1), st = r === 0 ? ' s="1"' : ' s="2"';
      if (v === null || v === undefined || v === '') return '';
      if (typeof v === 'number' && isFinite(v)) return `<c r="${ref}"${r === 0 ? st : ' s="3"'}><v>${v}</v></c>`;
      return `<c r="${ref}" t="inlineStr"${st}><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
    }).join('') + '</row>').join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${cols}</cols><sheetData>${rows}</sheetData>${h.filas.length ? `<autoFilter ref="A1:${col(h.columnas.length - 1)}${h.filas.length + 1}"/>` : ''}</worksheet>`;
  }

  function escribir(hojas, nombre) {
    const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${hojas.map((h, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`;
    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
    const wb = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${hojas.map((h, i) => `<sheet name="${esc(h.nombre.slice(0, 31))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>${hojas.map((h, i) => h.filas.length ? `<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${esc(h.nombre.slice(0, 31))}'!$A$1:$${col(h.columnas.length - 1)}$${h.filas.length + 1}</definedName></definedNames>` : '').join('').replace(/<\/definedNames><definedNames>/g, '')}</workbook>`;
    const wbr = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${hojas.map((h, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${hojas.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
    const st = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0F5C5C"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
    const files = [{ name: '[Content_Types].xml', data: ct }, { name: '_rels/.rels', data: rels }, { name: 'xl/workbook.xml', data: wb }, { name: 'xl/_rels/workbook.xml.rels', data: wbr }, { name: 'xl/styles.xml', data: st }]
      .concat(hojas.map((h, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: hoja(h) })));
    const a = document.createElement('a'); a.href = URL.createObjectURL(zip(files)); a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  async function unzip(buf) {
    const dv = new DataView(buf), u8 = new Uint8Array(buf), out = {};
    let e = buf.byteLength - 22; while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
    if (e < 0) throw new Error('El archivo no es un Excel (.xlsx) válido');
    let p = dv.getUint32(e + 16, true); const n = dv.getUint16(e + 10, true);
    for (let i = 0; i < n; i++) {
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
      const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nl));
      const ds = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true);
      const raw = u8.subarray(ds, ds + csize);
      out[name] = { method, raw };
      p += 46 + nl + xl + cl;
    }
    return out;
  }
  async function texto(f) {
    if (!f) return '';
    if (f.method === 0) return new TextDecoder().decode(f.raw);
    if (typeof DecompressionStream === 'undefined') throw new Error('Su navegador no puede leer archivos Excel; actualícelo.');
    const s = new Blob([f.raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return await new Response(s).text();
  }
  const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (m, d) => String.fromCharCode(d)).replace(/&amp;/g, '&');
  const tTexts = x => { const m = x.match(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g) || []; return unesc(m.map(t => t.replace(/<[^>]+>/g, '')).join('')); };
  const colNum = ref => { const l = ref.replace(/\d+/g, ''); let n = 0; for (const ch of l) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; };

  async function leer(file) {
    const z = await unzip(await file.arrayBuffer());
    const shared = []; const sx = await texto(z['xl/sharedStrings.xml']);
    (sx.match(/<(?:\w+:)?si\b[\s\S]*?<\/(?:\w+:)?si>/g) || []).forEach(si => shared.push(tTexts(si)));
    const wb = await texto(z['xl/workbook.xml']), wbr = await texto(z['xl/_rels/workbook.xml.rels']);
    const relMap = {}; (wbr.match(/<Relationship\b[^>]*>/g) || []).forEach(r => { const id = (r.match(/Id="([^"]+)"/) || [])[1], t = (r.match(/Target="([^"]+)"/) || [])[1]; relMap[id] = t.replace(/^\/?xl\//, '').replace(/^\//, ''); });
    const res = {};
    for (const s of (wb.match(/<(?:\w+:)?sheet\b[^>]*>/g) || [])) {
      const nombre = unesc((s.match(/name="([^"]*)"/) || [])[1] || ''), rid = (s.match(/r:id="([^"]+)"/) || [])[1];
      const x = await texto(z['xl/' + relMap[rid]]);
      const filas = [];
      (x.match(/<(?:\w+:)?row\b[\s\S]*?<\/(?:\w+:)?row>/g) || []).forEach(rw => {
        const rn = Number((rw.match(/\br="(\d+)"/) || [])[1]) - 1; const f = [];
        (rw.match(/<(?:\w+:)?c\b[^>]*\/>|<(?:\w+:)?c\b[\s\S]*?<\/(?:\w+:)?c>/g) || []).forEach(c => {
          const ref = (c.match(/\br="([A-Z]+\d+)"/) || [])[1]; if (!ref) return;
          const t = (c.match(/\bt="(\w+)"/) || [])[1]; const v = (c.match(/<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/) || [])[1];
          let val = '';
          if (t === 's') val = shared[Number(v)] || ''; else if (t === 'inlineStr') val = tTexts(c); else if (t === 'str' || t === 'b') val = v != null ? unesc(v) : ''; else val = v != null ? Number(v) : '';
          f[colNum(ref)] = val;
        });
        filas[rn] = f;
      });
      res[nombre] = Array.from(filas, f => Array.from(f || [], v => v == null ? '' : v));
    }
    return res;
  }
  window.XLSX = { escribir, leer };
})();
