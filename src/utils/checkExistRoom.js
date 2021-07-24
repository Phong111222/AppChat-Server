export const CheckSingleRoomExist = (arr, checkArr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].users.toString() === checkArr.toString()) return true;
  }
  return false;
};
