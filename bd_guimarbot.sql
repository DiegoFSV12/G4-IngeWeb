-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-11-2024 a las 17:17:49
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_guimarbot`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `admin_fname` varchar(150) NOT NULL,
  `admin_lname` varchar(150) NOT NULL,
  `admin_username` varchar(50) NOT NULL,
  `admin_email` varchar(250) NOT NULL,
  `admin_birth` date NOT NULL,
  `admin_dni` varchar(8) NOT NULL,
  `admin_state` char(1) NOT NULL,
  `admin_pass` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admins`
--

INSERT INTO `admins` (`admin_id`, `admin_fname`, `admin_lname`, `admin_username`, `admin_email`, `admin_birth`, `admin_dni`, `admin_state`, `admin_pass`) VALUES
(1, 'Diego Fabrizio', 'Sanchez Vera', 'dsanchezver', 'diego@gmail.com', '2004-11-16', '71644798', '1', '$2a$08$JzSTdPayuS0RPKAGfXcTtuWJh8UxEsSfHroMWK5VdAEkx5NY57T7u'),
(4, 'Daniel Andre', 'Tragodara Angulo', 'dtragodaraang', 'dtragodara12@gmail.com', '2000-10-10', '74977475', '1', '$2a$08$8B4529EH1VX.73D8mc/PmucNtl0E7ilsI2vEYxqbExtdcoEFfR1Zi'),
(5, 'Gonzalo kakaroto', 'Cardenas Sachun', 'gcardenassac', 'cardenas123@gmail.com', '2005-11-16', '78944147', '1', '$2a$08$d6zZUd2Y/6hpjeVILJ8W.ulXAMlAqgLfLumk2wXm94lXrWHzQF/Om'),
(6, 'Eduardo Sebastian', 'Angulo Sachun', 'eangulosac', 'sachuntorey@hotmail.com', '2003-12-24', '22222222', '1', '$2a$08$H6erUIzMY75muskR8aQ9pe2oOzeF.Io7qyoMfkF0X3AdlhlkF2l.a'),
(7, 'Juan Alberto', 'Rodriguez Perez', 'jrodriguezper', 'jrodriguez123@gmail.com', '2002-01-01', '77777777', '1', '$2a$08$6o6cZjygzDkvSBdopB995.FcwC2V3gDUsDq1MweE.FxlsNAUX.mpm'),
(8, 'Sebastian Eduardo', 'Cardenas Vera', 'scardenasver', 'diegoc@gmail.com', '2002-06-04', '72477989', '1', '$2a$08$14vbCj7aiV4YXz1LL9Mg8OsFNh.vNLZM8TA8vRLGixjys1MTgMY1u'),
(9, 'Pedro Ernesto', 'Ramirez Huanca', 'pramirezhua', 'pernesto@gmail.com', '2002-02-05', '72447897', '1', '$2a$08$F81LVSN73BHK45WCcQtmAegvqZEphwO2MLmvT2katnbQfCGXJH9fq'),
(10, 'Juan David', 'Cardenas Godoy', 'jcardenasgod', 'jpedro@gmail.com', '2001-12-31', '72447898', '1', '$2a$08$uLsQ7z4s.SndBX.ROC1T0OgmOLuUXevGeYL0kAT88jmh9.fFTZouG'),
(11, 'Pedro Juan', 'Angulo Garay', 'pangulogar', 'dangulo@gmail.com', '2002-12-30', '72447878', '1', '$2a$08$4/bV98CdeAjYolUoQ7wWqerTOtPpI1oXjbM2sR9DvJSKfHykJANHy'),
(12, 'Furina', 'Focalors Tao', 'ffocalorstao', 'furina@gmail.com', '2024-11-16', '71311489', '1', '$2a$08$0HZ/.gAn/1cdHVyrxMCXP.IJd4fyUTBC1p6QXLeGq3AD.7zYMThvy');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `curso_id` int(11) NOT NULL,
  `curso_name` varchar(100) NOT NULL,
  `curso_descripction` varchar(250) NOT NULL,
  `curso_teacherID` int(11) NOT NULL,
  `curso_img` varchar(200) NOT NULL,
  `curso_price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`curso_id`, `curso_name`, `curso_descripction`, `curso_teacherID`, `curso_img`, `curso_price`) VALUES
(22, 'Ciencias del fracaso', 'cursito xd', 1, 'https://vilmanunez.com/wp-content/uploads/2016/03/herramientas-y-recursos-para-crear-curso-online.png', 50),
(23, 'Liderazgo y Emprendimiento', '', 1, 'https://crehana-blog.imgix.net/media/filer_public/4a/b3/4ab3a03d-1acb-4b58-81fa-510154b2a528/emprendedidurismo-_pxhere.jpg?auto=format&q=50', 50),
(24, 'Curso de programación en JAVA', '', 1, 'https://blog.facialix.com/wp-content/uploads/2021/03/java-curso-1.jpg', 50),
(25, 'Curso de Python', 'aea', 1, 'https://i.ytimg.com/vi/chPhlsHoEPo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBqTdzxyKwXzBBlEd_ZUu7SyuEajg', 50),
(27, 'Panadero termonuclear', 'dadwda', 1, 'https://universidadsideralcarrion.com/storage/img/Carreras/Ciencias/panadero_nuclear.png', 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso_comentarios`
--

CREATE TABLE `curso_comentarios` (
  `comentario_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `cursoID` int(11) NOT NULL,
  `comentario` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `curso_comentarios`
--

INSERT INTO `curso_comentarios` (`comentario_id`, `user_id`, `created_At`, `cursoID`, `comentario`) VALUES
(1, 19, '2024-11-21 07:25:54', 23, 'adasdasd'),
(2, 19, '2024-11-21 07:26:31', 23, 'test'),
(3, 19, '2024-11-21 07:28:56', 23, 'test 2'),
(4, 19, '2024-11-21 07:33:47', 23, 'asdasd'),
(5, 19, '2024-11-21 16:17:15', 25, 'El mejor curso de Python');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recursos`
--

CREATE TABLE `recursos` (
  `recurso_id` int(11) NOT NULL,
  `recurso_name` varchar(100) NOT NULL,
  `recurso_description` varchar(250) NOT NULL,
  `recurso_url` varchar(200) NOT NULL,
  `recurso_img` varchar(200) NOT NULL,
  `recurso_cursoID` int(11) NOT NULL,
  `recurso_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recursos`
--

INSERT INTO `recursos` (`recurso_id`, `recurso_name`, `recurso_description`, `recurso_url`, `recurso_img`, `recurso_cursoID`, `recurso_order`) VALUES
(1, 'Introducción', 'Video random de sparking goty', 'https://www.youtube.com/watch?v=H9vIuROrs1Y', 'resources/img/fondo-guimarbot.jpg', 23, 1),
(2, 'Curso Prueba BD', 'aaa', 'https://www.youtube.com/watch?v=H9vIuROrs1Y', 'resources/img/fondo-guimarbot.jpg', 24, 2),
(3, 'Introducción', '✅ Curso Maestro de Python: De Cero a Programador Master 😎 #1', 'https://www.youtube.com/watch?v=HKL1G9-mwcM', 'resources/img/fondo-guimarbot.jpg', 25, 1),
(4, 'Tipos de Datos', '✅ Curso Maestro de Python: Tipos de Datos 😎 #2', 'https://www.youtube.com/watch?v=v5zoIqha5U4', '	\r\nresources/img/fondo-guimarbot.jpg', 25, 2),
(5, 'Asignación Múltiple', '✅ Curso Maestro de Python: Asignación Múltiple 😎 #3', 'https://www.youtube.com/watch?v=GTSGnpM-6_k', 'resources/img/fondo-guimarbot.jpg', 25, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rutas`
--

CREATE TABLE `rutas` (
  `ruta_id` int(11) NOT NULL,
  `ruta_name` varchar(100) NOT NULL,
  `ruta_description` varchar(250) NOT NULL,
  `ruta_creator` varchar(100) NOT NULL,
  `ruta_img` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rutas`
--

INSERT INTO `rutas` (`ruta_id`, `ruta_name`, `ruta_description`, `ruta_creator`, `ruta_img`) VALUES
(1, 'Ruta Full JavaScript Avanzado', 'dbwadgawdjakwdjkabhdkjahkjdhakjdhakjwhdkjawhdkjah\r\n', 'PLACEHOLDER', '\"resources/img/curso-js.webp\"'),
(2, 'Ruta HTML + CSS desde Cero', 'lorem', 'PLACEHOLDER', '\"resources/img/curso-js.webp\"'),
(4, 'Ruta PHP Avanzado', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(7, 'Ruta Full ', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(8, 'Ruta1', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(9, 'Ruta2', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(10, 'Ruta3', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(11, 'rutaxd', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(12, 'rutita', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(13, 'aeaaaaa', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(14, 'Ruta Firulaiks', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(15, 'ruta aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(16, 'uno dos', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg'),
(17, 'P1 Ruta', 'lorem', 'PLACEHOLDER', 'resources/img/fondo-guimarbot.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ruta_comentarios`
--

CREATE TABLE `ruta_comentarios` (
  `comentario_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `ruta_id` int(11) NOT NULL,
  `comentario` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ruta_comentarios`
--

INSERT INTO `ruta_comentarios` (`comentario_id`, `user_id`, `created_At`, `ruta_id`, `comentario`) VALUES
(1, 19, '2024-11-21 15:56:33', 1, 'La mejor ruta javascript');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ruta_curso`
--

CREATE TABLE `ruta_curso` (
  `rc_id` int(11) NOT NULL,
  `ruta_ID` int(11) NOT NULL,
  `curso_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ruta_curso`
--

INSERT INTO `ruta_curso` (`rc_id`, `ruta_ID`, `curso_ID`) VALUES
(1, 14, 22),
(2, 2, 22),
(3, 1, 22),
(4, 17, 25),
(5, 2, 27);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_FirstName` varchar(100) NOT NULL,
  `user_LastName` varchar(100) NOT NULL,
  `user_birth` date NOT NULL,
  `user_name` varchar(32) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_pass` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `user_FirstName`, `user_LastName`, `user_birth`, `user_name`, `user_email`, `user_pass`) VALUES
(1, 'Diego Fabrizio', 'Sanchez Vera', '2004-11-16', 'USUARIOPLACEHOLDER', 'dsanchezver@ucvvirtual.edu.pe', '$2a$08$6QYtcJSDvrKb0SUFdL4dUeAvyS6Ikl7oOfAHlSNEKZ9JZRFn.xgsW'),
(2, 'Diego Fabrizio', 'Sanchez Vera', '2004-11-16', 'USUARIOPLACEHOLDER', 'diefra_save1996@hotmail.com', '$2a$08$JSgIEe2PQcki5sCwvtRHluSTFwcZJQ/z8fHDB2TL6/OHTsRCIZoqi'),
(3, 'Sebastian', 'Cardenas', '2005-11-16', 'USUARIOPLACEHOLDER', 'cooldiego70@gmail.com', '$2a$08$aEpze6GwWVn88SxjjBL/cusT/e3IxknAmRRFox3b42e012vftNn5m'),
(4, 'Gonzalo', 'Cardenas Sachun', '2005-11-16', 'gcardenassac', 'cardenas123@gmail.com', '$2a$08$OMpjzADtZ0RFsBRgNsn8QeemQeaxkMLKpEAzzUtIh5YwdGuImaug6'),
(5, 'Daniel Andre', 'Tragodara Angulo', '2002-11-16', 'dtragodaraang', 'dtragodara12@gmail.com', '$2a$08$PixMhnouXFdtFTy/jpps5.kavX/.SUOgcLLRF18T7W1fGQzkxtHse'),
(6, 'Sebastian Eduardo', 'Cardenas Sachun', '2004-08-19', 'scardenassac', 'sachuntorade@gmail.com', '$2a$08$ucvPAQZsa2Z8eCUV.v1gveoseOJT3OQIFkHyv5jCb7Q0Ecquuzjdi'),
(7, 'Firulaiks', 'Escalante', '2018-01-02', 'fescalante', 'firu@gmail.com', '$2a$08$kO3i2mUwpwEJLA8eQqFt5.T/yX6NyedXuVjpb6.lO8Q9HmKJxEb5e'),
(8, 'Tilin', 'Tilinsito', '2024-10-22', 'ttilinsito', 'tilin@gmail.com', '$2a$08$.QagLehTOya/j/rxPUhUv.kGtO.Ugh0iyBFSX1ygIzaUnCEe/sWHS'),
(9, 'Eduardo', 'Cardenas Sachun', '1989-01-25', 'ecardenassac', 'willson69@gmail.com', '$2a$08$9SrqwbkD3WCsjXs6GzGyD.eNiHvSNfas4UDrZ3i4Kk1z4J9U3qDrO'),
(10, 'Diego Fabrizio', 'Sanchez Vera', '2004-11-16', 'dsanchezver', 'diego123@gmail.com', '$2a$08$fRfkUYhiqCijN7UCtb3L8ecS13ok3NULOFZ4p1AwJZhWOq7/25nk.'),
(11, 'Juan Boris', 'Escalante Padilla', '2021-01-12', 'jescalantepad', 'juan@gmail.com', '$2a$08$ym/sh14HNR5Cm03SzvRn8up1tAoEIkGXpfwYOvo6x3q/txfSfjqx.'),
(12, 'Diego Ernesto', 'Padilla Sanchez', '2020-12-31', 'dpadillasan', 'dsanchez@gmail.com', '$2a$08$1Rsdn4rglejxhoJ0DreJPedm2EMOCByYjOsvYSSHtrIbg0LlZ/HvG'),
(13, 'Dieguito', 'Perez', '2020-01-07', 'dperez', 'perez@gmail.com', '$2a$08$102X8lyITElVjv6bixzGuOEL3wym7oefSo7hjhQsrnd5obG8SnaSq'),
(14, 'Rodrigo', 'Guzman', '2003-06-10', 'rguzman', 'guzman@gmail.com', '$2a$08$BHE7NtoDGJJOslYTo2VQNeJL1CA/VA/9f.iJdycSrXQgx5eoMErpO'),
(15, 'Boris', 'Escalante Padilla', '2024-11-01', 'bescalantepad', 'diegodxd@gmail.com', '$2a$08$tGGEDDe9fc6GnlHkyluZX.L8ADsWMQDFjAy.TZbekxWLK7wefbODa'),
(16, 'Firulaiks', 'Cardenas Sachun', '2024-11-01', 'fcardenassac', 'goku@hotmail.com', '$2a$08$VIsMwaR1m/bUYExNT9lBlebcJzOeTYtxCI5F69qDxzpYb/tx2zpPS'),
(17, 'Hu Tao', 'Rodriguez Gutierrez', '1999-12-27', 'hrodriguezgut', 'tao@gmail.com', '$2a$08$h4GLolak2S9q6yADuXfRdOwfrV4IUMEbYpl7qDevUa21JIVBURUd6'),
(18, 'aaaa', 'aaa', '2024-11-11', 'aaaa', 'qwe@gmail.com', '$2a$08$SL6Pn.pSet1pv.tFXQK7uuq2.EcPF934Add0WIWADT2.YWo0gVzFW'),
(19, 'Cristhian', 'Mendoza Alcantara', '2004-06-24', 'cmendozaalc', 'cmendozaalc@ucvvirtual.edu.pe', '$2a$08$iQF6HCutf7d7EELdMkH0a.pDPc2JU1683bbByFNlmwXD4z/hCJO66'),
(20, 'Cristhian', 'Mendoza Alcantara', '2004-06-24', 'cmendozaalc', 'cmendozaalc@ucvvirtual.edu.pe', '$2a$08$2Ppjz/mUA1A4/OlfyUAByO.FxZNxJve.M2fBAEglLgXg4WXZjzYJC');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`curso_id`) USING BTREE,
  ADD KEY `TeacherID` (`curso_teacherID`);

--
-- Indices de la tabla `curso_comentarios`
--
ALTER TABLE `curso_comentarios`
  ADD PRIMARY KEY (`comentario_id`),
  ADD KEY `cursoID` (`cursoID`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD PRIMARY KEY (`recurso_id`),
  ADD KEY `CursoID` (`recurso_cursoID`);

--
-- Indices de la tabla `rutas`
--
ALTER TABLE `rutas`
  ADD PRIMARY KEY (`ruta_id`);

--
-- Indices de la tabla `ruta_comentarios`
--
ALTER TABLE `ruta_comentarios`
  ADD PRIMARY KEY (`comentario_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ruta_id` (`ruta_id`) USING BTREE;

--
-- Indices de la tabla `ruta_curso`
--
ALTER TABLE `ruta_curso`
  ADD PRIMARY KEY (`rc_id`),
  ADD KEY `ruta_ID` (`ruta_ID`),
  ADD KEY `curso_ID` (`curso_ID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `curso_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `curso_comentarios`
--
ALTER TABLE `curso_comentarios`
  MODIFY `comentario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `recursos`
--
ALTER TABLE `recursos`
  MODIFY `recurso_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `rutas`
--
ALTER TABLE `rutas`
  MODIFY `ruta_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `ruta_comentarios`
--
ALTER TABLE `ruta_comentarios`
  MODIFY `comentario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ruta_curso`
--
ALTER TABLE `ruta_curso`
  MODIFY `rc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `curso_comentarios`
--
ALTER TABLE `curso_comentarios`
  ADD CONSTRAINT `curso_comentarios_ibfk_1` FOREIGN KEY (`cursoID`) REFERENCES `curso` (`curso_id`),
  ADD CONSTRAINT `curso_comentarios_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Filtros para la tabla `ruta_comentarios`
--
ALTER TABLE `ruta_comentarios`
  ADD CONSTRAINT `ruta_comentarios_ibfk_1` FOREIGN KEY (`ruta_id`) REFERENCES `rutas` (`ruta_id`),
  ADD CONSTRAINT `ruta_comentarios_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Filtros para la tabla `ruta_curso`
--
ALTER TABLE `ruta_curso`
  ADD CONSTRAINT `ruta_curso_ibfk_1` FOREIGN KEY (`ruta_ID`) REFERENCES `rutas` (`ruta_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ruta_curso_ibfk_2` FOREIGN KEY (`curso_ID`) REFERENCES `curso` (`curso_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
