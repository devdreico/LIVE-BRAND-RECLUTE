export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mppwnnng'

export type FormspreeResult =
  | { ok: true; status: number }
  | { ok: false; status?: number; error: string }

type FormspreeErrorBody = { errors?: { message?: string }[] }

export type FormspreePayload = Record<string, string>

export async function submitToFormspree(
  payload: FormspreePayload,
  endpoint: string = FORMSPREE_ENDPOINT,
): Promise<FormspreeResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) return { ok: true, status: response.status }

    let message = 'No pudimos enviar tu inscripción. Vuelve a intentarlo.'
    try {
      const body = (await response.json()) as FormspreeErrorBody
      const apiMessage = body?.errors?.[0]?.message
      if (typeof apiMessage === 'string' && apiMessage.trim()) message = apiMessage
    } catch {
      if (response.status === 429)
        message = 'Demasiados envíos en poco tiempo. Espera un minuto y vuelve a intentarlo.'
      if (response.status === 404)
        message = 'El formulario de admisión no responde. Escríbenos por WhatsApp.'
    }

    return { ok: false, status: response.status, error: message }
  } catch {
    return {
      ok: false,
      error: 'No hay conexión con el servidor. Revisa tu internet y vuelve a intentarlo.',
    }
  }
}
