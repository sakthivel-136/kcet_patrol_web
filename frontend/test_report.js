const axios = require('axios');
async function run() {
  const login = await axios.post('http://localhost:8000/auth/login', {
    security_id: 'admin',
    security_password: 'admin'
  });
  const token = login.data.access_token;
  
  const res = await axios.get('http://localhost:8000/report/download?campus_code=KCET01&report_date=2026-09-09', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = res.data;
  const qrs = new Set(data.map(d => d.qr_name));
  console.log("Total QRs in report:", qrs.size);
  console.log("QR names:", Array.from(qrs).sort());
}
run();
