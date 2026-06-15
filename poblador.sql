-- Vamos a utilizar la extension de pgcrypto para poder hashear la contrasenia caso contrario no nos dejaria iniciar sesion
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    u1_id uuid;
    u2_id uuid;
    -- Esta sera la contrasenia que se debe ingresar al iniciar sesion
    test_password text := '12345678';
    test_password2 text := 'batiContra';
BEGIN
    -- usuarios
    INSERT INTO public."User" (name, email, password_hash)
    VALUES ('Web Programada', 'websito@gmail.com', crypt(test_password, gen_salt('bf')))
    RETURNING user_id INTO u1_id;
    INSERT INTO public."User" (name, email, password_hash)
    VALUES ('Bruce Wayne', 'bruce@bati.com', crypt(test_password2, gen_salt('bf')))
    RETURNING user_id INTO u2_id;

    -- tasks de usuarios websito
    INSERT INTO public."Task" (name, description, completed, priority, user_id) VALUES
    ('Hacer el https', 'Hacer la web segura para evitar indeseables', true, 9, u1_id),
    ('Agregar Oauth', 'Para poder loggearse con google directametne', false, 9, u1_id),
    ('Roles', 'Realizar la direnciacion de roles agregando JWT', true, 5, u1_id),
    ('Agregar front', 'Hay que agregar el frontend para poder usar el backend consumiendo la api', false, 5, u1_id),
    ('Actualizar la main', 'Tener todo listo en el main para poder presentar al inge <3', true, 1, u1_id);
    -- bruce wayne
    INSERT INTO public."Task" (name, description, completed, priority, user_id) VALUES
    ('Visitar arckham', 'Llevar un pastel al Guason', false, 9, u2_id),
    ('Patrullar con robin', 'Patrullar al quinta y la septima avenida, gordon dijo que habia un sospechoso', true, 5, u2_id),
    ('Comprar lego batman', 'Se dignaron a hacerme mi version lego asi que la comprare', false, 9, u2_id),
    ('Cena con el gobernador', 'Me debo quitar la mascara, ire como bruce', false, 5, u2_id),
    ('Comprar ruedas', 'A mi batimovil se le poncho una batirueda', true, 1, u2_id);
END $$;