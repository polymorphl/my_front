echo "Generate a PFX from SSL cert"

openssl pkcs12 -export -out ssl/server.pfx -inkey ssl/server.key -in ssl/server.csr