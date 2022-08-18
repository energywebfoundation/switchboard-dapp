export const sortingEnrolmentData = (item, property) => {
  if (property === 'status') {
    if (item.isAccepted) {
      if (item.isSynced) {
        return 'approved';
      } else {
        return 'approved pending sync';
      }
    } else {
      if (item.isRejected) {
        return 'rejected';
      } else {
        return 'pending';
      }
    }
  } else {
    return item[property];
  }
};
