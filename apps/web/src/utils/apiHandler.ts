export function getApiLink() {
	// Quizas en el futuro agrege un if que retorne algo diferente si estoy en dev o no
	return process.env.NEXT_PUBLIC_API_URL;
}
