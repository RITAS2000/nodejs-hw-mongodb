import { ContactsCollection } from '../models/contact.js';

export async function getAllContacts(
  page,
  perPage,
  sortBy,
  sortOrder,
  isFavourite,
  contactType,
  userId,
) {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const filter = { userId };

  if (typeof isFavourite === 'boolean') {
    filter.isFavourite = isFavourite;
  }

  if (contactType) {
    filter.contactType = contactType;
  }
  const contactsQuery = ContactsCollection.find(filter);
  const [totalItems, data] = await Promise.all([
    ContactsCollection.countDocuments(filter),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
}

export async function getContactById(contactId, userId) {
  const contactById = await ContactsCollection.findOne({
    _id: contactId,
    userId,
  });
  return contactById;
}

export function createContact(payload) {
  return ContactsCollection.create(payload);
}

export function updateContact(contactId, userId, payload) {
  return ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
    },
  );
}

export function deleteContact(contactId, userId) {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
}
