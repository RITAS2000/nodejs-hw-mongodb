import createHttpError from 'http-errors';

import { parsPaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParems.js';

import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export async function showContactsController(req, res) {
  const { page, perPage } = parsPaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { isFavourite, contactType } = parseFilterParams(req.query);
  const contacts = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    isFavourite,
    contactType,
    req.user.id,
  ).catch((error) => {
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

export async function showContactByIdController(req, res) {
  const { contactId } = req.params;

  const contact = await getContactById(contactId, req.user.id);

  if (contact === null) {
    throw createHttpError.NotFound('Contact not found');
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

export async function createNewContactController(req, res) {
  const contact = await createContact({ ...req.body, userId: req.user.id });

  res
    .status(201)
    .set('Content-Type', 'application/json')
    .send(
      JSON.stringify(
        {
          status: 201,
          message: 'Successfully created a contact!',
          data: contact,
        },
        null,
        2,
      ),
    );
}

export async function updateContactController(req, res) {
  const result = await updateContact(
    req.params.contactId,
    req.user.id,
    req.body,
  );

  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res
    .status(200)
    .set('Content-Type', 'application/json')
    .send(
      JSON.stringify(
        {
          status: 200,
          message: 'Successfully patched a contact!',
          data: result,
        },
        null,
        2,
      ),
    );
}

export async function deleteContactController(req, res) {
  const result = await deleteContact(req.params.contactId, req.user.id);

  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(204).end();
}
