import { getAllContacts } from '../services/contacts.js';

export async function showContacts(req, res) {
  const contacts = await getAllContacts().catch((error) => {
    return res.status(500).json({
      status: 500,
      message: 'Error retrieving contacts',
      error: error.message,
    });
  });

  if (!contacts) return;

  res
    .status(200)
    .set('Content-Type', 'application/json')
    .send(
      JSON.stringify(
        {
          status: 200,
          message: 'Successfully found contacts!',
          data: contacts,
        },
        null,
        2,
      ),
    );
}
