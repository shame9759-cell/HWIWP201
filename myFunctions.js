var slide = 0;

function nextSlide() {
  var imgs = $("#slider img");
  imgs.eq(slide).fadeOut(800);
  slide = (slide + 1) % imgs.length;
  imgs.eq(slide).fadeIn(800);
}

function validDate(s) {
  var d = new Date(s);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(d) && d.toISOString().substr(0, 10) == s;
}

function showMsg(type, text) {
  $("#result").attr("class", type).html(text).show();
}

function send() {
  var name = $("#name").val().trim(), nid = $("#nid").val(), start = $("#start").val(), end = $("#end").val();
  var phone = $("#phone").val(), email = $("#email").val(), cars = $(".sel:checked");
  if (cars.length == 0) showMsg("error", "اختر سيارة واحدة على الأقل");
  else if (name != "" && !/^[ء-ي ]+$/.test(name)) showMsg("error", "الاسم يجب أن يكون بأحرف عربية فقط");
  else if (!/^(0[1-9]|1[0-4])\d{9}$/.test(nid)) showMsg("error", "الرقم الوطني 11 خانة وأول خانتين من 01 إلى 14");
  else if (!validDate(start)) showMsg("error", "تاريخ البداية يجب أن يكون بصيغة yyyy-mm-dd");
  else if (!validDate(end)) showMsg("error", "تاريخ النهاية يجب أن يكون بصيغة yyyy-mm-dd");
  else if (end <= start) showMsg("error", "تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
  else if (phone != "" && !/^09[345689]\d{7}$/.test(phone)) showMsg("error", "رقم الموبايل يجب أن يكون Syriatel أو MTN");
  else if (email != "" && !/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) showMsg("error", "البريد الإلكتروني غير صحيح");
  else {
    var days = (new Date(end) - new Date(start)) / 86400000, total = 0, text = "<strong>تم استلام طلب الحجز</strong><br />";
    for (var i = 0; i < cars.length; i++) {
      var td = $(cars[i]).closest("tr").children();
      total += parseInt(td.eq(3).text()) * days;
      text += td.eq(1).text() + ": " + days + " يوم<br />";
    }
    var discount = days > 10 ? total * 5 / 100 : 0;
    showMsg("ok", text + "المجموع: " + total + " ل.س<br />الخصم: " + discount + " ل.س<br /><strong>المبلغ النهائي: " + (total - discount) + " ل.س</strong>");
  }
  return false;
}

$(document).ready(function () {
  if ($("#slider").length) setInterval(nextSlide, 5000);
  $(".show").click(function () {
    var info = $(this).closest("tr").next().find(".info");
    if (this.checked) info.slideDown(300); else info.slideUp(300);
  });
  $(".sel").click(function () {
    $(this).closest("tr").toggleClass("selected", this.checked);
  });
  $("#next").click(function () {
    var none = $(".sel:checked").length == 0;
    $("#carMsg").toggle(none);
    if (!none) $("#booking").slideDown(500, function () {
      $("html, body").animate({ scrollTop: $(this).offset().top - 60 }, 500);
    });
  });
  $("#booking").submit(send);
});
