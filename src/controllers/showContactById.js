import { getContactById } from '../services/contacts.js';

export async function showContactById(req, res) {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  res
    .status(200)
    .set('Content-Type', 'application/json')
    .send(
      JSON.stringify(
        {
          status: 200,
          message: `Successfully found contact with id ${contactId}!`,
          data: contact,
        },
        null,
        2,
      ),
    );
}
