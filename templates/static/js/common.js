function current_page() {
  console.log(PAGE_MODE);
  $(".menu-btn").removeClass('active');
  $('.' + PAGE_MODE).addClass('active');
  console.log($(".menu-btn"));
}