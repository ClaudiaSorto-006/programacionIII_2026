from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

# Función sencilla para conectar a la base de datos MySQL
def conectar():
    conexion = mysql.connector.connect(
        host="localhost",
        user="root",
        password="", # Déjalo vacío si usas XAMPP por defecto
        database="db_academica"
    )
    return conexion

# Punto 5: Mostrar el login primero al ejecutar el servidor
@app.route('/')
def mostrar_login():
    return render_template('login.html')

# Ruta para abrir el formulario de usuarios cuando el login sea correcto
@app.route('/usuarios')
def mostrar_usuarios():
    return render_template('usuarios.html')

@app.route('/index')
def mostrar_index():
    db = conectar()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(*) AS total,
               SUM(telefono IS NOT NULL AND telefono <> '') AS con_telefono,
               SUM(direccion IS NOT NULL AND direccion <> '') AS con_direccion,
               SUM(nombre <> '' AND telefono <> '' AND direccion <> '') AS completos
        FROM usuarios_usss002825
    """)
    r = cursor.fetchone()

    cursor.execute("""
        SELECT idUsuario, usuario, nombre, telefono
        FROM usuarios_usss002825
        ORDER BY idUsuario DESC LIMIT 5
    """)
    ultimos = cursor.fetchall()
    db.close()

    return render_template('index.html',
        total=int(r['total'] or 0),
        con_telefono=int(r['con_telefono'] or 0),
        con_direccion=int(r['con_direccion'] or 0),
        completos=int(r['completos'] or 0),
        ultimos=ultimos)

# Punto 5: Revisar si el usuario y la clave existen en la tabla usuarios_usss002825
@app.route('/login', methods=['POST'])
def login():
    datos = request.json
    usuario = datos['usuario']
    clave = datos['clave']

    db = conectar()
    cursor = db.cursor()
    
    sql = "SELECT * FROM usuarios_usss002825 WHERE usuario = %s AND clave = %s"
    cursor.execute(sql, (usuario, clave))
    resultado = cursor.fetchone()
    
    db.close()

    if resultado != None:
        return jsonify({"exito": True})
    else:
        return jsonify({"exito": False})

# Puntos 3 y 4: Método crud_usuarios_usss002825 (Guardar, Buscar, Editar y Eliminar)
@app.route('/crud_usuarios_usss002825', methods=['POST'])
def crud_usuarios_usss002825():
    datos = request.json
    accion = datos['accion']

    db = conectar()
    cursor = db.cursor(dictionary=True)

    # 1. GUARDAR NUEVO USUARIO
    if accion == "guardar":
        sql = "INSERT INTO usuarios_usss002825 (usuario, clave, nombre, direccion, telefono) VALUES (%s, %s, %s, %s, %s)"
        valores = (datos['usuario'], datos['clave'], datos['nombre'], datos['direccion'], datos['telefono'])
        cursor.execute(sql, valores)
        db.commit()
        db.close()
        return jsonify({"mensaje": "Usuario guardado con éxito"})

    # 2. BUSCAR USUARIOS
    elif accion == "buscar":
        texto = "%" + datos['texto'] + "%"
        sql = "SELECT * FROM usuarios_usss002825 WHERE nombre LIKE %s OR usuario LIKE %s"
        cursor.execute(sql, (texto, texto))
        lista = cursor.fetchall()
        db.close()
        return jsonify(lista)

    # 3. EDITAR USUARIO EXISTENTE
    elif accion == "editar":
        sql = "UPDATE usuarios_usss002825 SET usuario=%s, clave=%s, nombre=%s, direccion=%s, telefono=%s WHERE idUsuario=%s"
        valores = (datos['usuario'], datos['clave'], datos['nombre'], datos['direccion'], datos['telefono'], datos['idUsuario'])
        cursor.execute(sql, valores)
        db.commit()
        db.close()
        return jsonify({"mensaje": "Usuario editado con éxito"})

    # 4. ELIMINAR USUARIO
    elif accion == "eliminar":
        sql = "DELETE FROM usuarios_usss002825 WHERE idUsuario = %s"
        cursor.execute(sql, (datos['idUsuario'],))
        db.commit()
        db.close()
        return jsonify({"mensaje": "Usuario eliminado"})

# Iniciar el servidor
if __name__ == '__main__':
    app.run(debug=True, port=5000)