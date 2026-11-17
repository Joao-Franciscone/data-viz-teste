require('dotenv').config({ path: '.env.dev' });
const db = require('../src/database/config');

const queries = [
  "ALTER TABLE aquario ADD COLUMN tipo_agua VARCHAR(20) DEFAULT 'doce'",
  "ALTER TABLE aquario ADD COLUMN tamanho DECIMAL(8,2) DEFAULT 0",
  `CREATE TABLE IF NOT EXISTS especies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_original VARCHAR(200),
    nome_normalizado VARCHAR(200) UNIQUE,
    fk_aquario INT,
    tipo_agua_preferido VARCHAR(20),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_aquario) REFERENCES aquario(id)
  )`
];

(async () => {
  for (const q of queries) {
    try {
      console.log('>>', q);
      const r = await db.executar(q);
      console.log('OK', r.affectedRows || JSON.stringify(r));
    } catch (e) {
      console.error('ERR', e.sqlMessage || e.message);
    }
  }
})();
