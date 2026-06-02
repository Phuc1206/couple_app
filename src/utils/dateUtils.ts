export const calculateLoveDays = (startDateString: string) => {
  const start = new Date(startDateString);
  const now = new Date();

  // Tính tổng số ngày
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Tính chi tiết Năm - Tháng - Ngày
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    // Lấy số ngày của tháng trước
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { totalDays, years, months, days };
};

export const getCountdown = (dateString: string, isRecurring: boolean = true) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Đưa về đầu ngày để tính cho chính xác số ngày

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  // Nếu là ngày lặp lại hàng năm (sinh nhật, valentine, kỷ niệm) mà đã qua trong năm nay rồi
  if (isRecurring && targetDate < now) {
    targetDate.setFullYear(now.getFullYear());
    // Nếu trong năm nay cũng qua rồi thì tính cho năm sau
    if (targetDate < now) {
      targetDate.setFullYear(now.getFullYear() + 1);
    }
  }

  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hôm nay luôn! 🎉";
  return `Còn ${diffDays} ngày`;
};
export const calculateLoveTimeDetailed = (startDateString: string) => {
  const start = new Date(startDateString);
  const now = new Date();

  const diffTime = Math.abs(now.getTime() - start.getTime());

  // Tính tổng số theo từng đơn vị riêng biệt
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
  // const totalMinutes = Math.floor(diffTime / (1000 * 60));
  const totalSeconds = Math.floor(diffTime / 1000);

  // Lấy phần dư để hiển thị kiểu: X giờ Y phút Z giây
  const displayHours = totalHours;
  const displayMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const displaySeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  return {
    totalSeconds,
    displayHours,
    displayMinutes,
    displaySeconds
  };
};
