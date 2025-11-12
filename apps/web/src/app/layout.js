import "./globals.css";
/* Voy a usar el router de NextJS, donde layout.tsx es el wrapper alrededor de todos los hijos y cada ruta es un folder */
export default function RootLayout({ children }) {
    return (<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>);
}
