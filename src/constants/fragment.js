export const Company = `{
  name
  logo
}`;

export const Poll = `{
  id
  name
  expiration
  pollLineItems{
    id
    name
    symbol
    time
    voters {
      id
      firstName
    }
  }
  createdAt
}`;

export const Team = `{
  id
  name
}`;

export const Venue = `{
  symbol
}`;

export const User = `{
  id
  firstName
  lastName
  email
  company${Company}
  venue${Venue}
  teams${Team}
}`;

export const Review = `{
  id
  content
  symbol
  company${Company}
  team${Team}
  user${User}
}`;

export const EventListItem = `{
  id
  name
  masterPhoneNumber
  note
  status
  groupSize
  createdAt
  time
}`;

export const EventDetails= `{
  id
  name
  masterPhoneNumber
  note
  status
  groupSize
  createdAt
  time
  venue${Venue}
  teams${Team}
  individuals${User}
  master${User}
  polls${Poll}
  symbol
  calendarId
}`;
