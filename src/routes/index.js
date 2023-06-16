const { Router } = require('express');
const router = Router();
// Endpoint para subir el archivo

router.get('/', (req, res) => res.send('Holete') )

module.exports = router;