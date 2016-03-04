/**
 * Created by yunpeng on 16/2/24.
 */
//页面调整

function viewadjust() {
    $('.main-content .item>.item-block').height($('.main-content .item').width());
    $('.main-content .item>.item-block').width($('.main-content .item').width());

    if ($(window).width() > 767) {
        $('.main-content .item>.item-block').eq(0).height($('.main-content .item').width() * 2);
        $('.main-content .item>.item-block').eq(9).height($('.main-content .item').width() * 2);

        /*footer*/
        $('footer .col-md-3').css('height', '');
        var max_height = $('footer .col-md-3').eq(0).height();
        for (var i = 1; i < 4; i++) {
            if ($('footer .col-md-3').eq(i).height() > max_height) {
                max_height = $('footer .col-md-3').eq(i).height();
            }
        }
        $('footer .col-md-3').height(max_height);
        /*footer end*/

        $('#navbar').css('width', '');
        $('.basket-bag-open').css('width', '');

        $('.text-middle').height($('.table-tbody .shopping-cat-product-img').width());
        $('.table-tbody .shopping-cat-product-img').height($('.table-tbody .shopping-cat-product-img').width());
        $('.shopping-cat-subtotal p').css('padding-right', $('.shopping-cat-table-right .text-middle').outerWidth() * 2 + 17 - $('.shopping-cat-subtotal-money').width() - 15 + 'px');
    } else {
        $('footer .col-md-3').css('height', '');
        $('#navbar').width($('.navbar').width());
        $('.basket-bag-open').width($('.navbar').width() - 42 * 2 - 30);

        $('.text-middle').height($('.text-middle').css('height', ''));
        $('.shopping-cat-subtotal p').css('padding-right', '');
        $('.table-tbody .shopping-cat-product-img').height($('.table-tbody .shopping-cat-product-img').parents('.table-tbody-row').height());
    }

    $('.table-tbody .shopping-cat-table-right').height($('.table-tbody .table-tbody-row').height() - 20);
}

$(document).ready(function () {
    //页面加载
    var flag = $('.login');
    if (flag.length == 0) {
        $('body').append('<div class="login"></div>').find('.login').load("./login.html .modal");
        $('header').load('./layout.html header .container', function () {
            isLogin();
            load();
            Price_refresh();
        });
        $('.relate').load('./layout.html .relate .container');

        $('footer').load('./layout.html footer .container', function () {
            viewadjust();
            //轮播开始
            t = setInterval(carouselStart, interval);
        });
    }

    function isLogin() {
        var user_name = sessionStorage.getItem('user_name');
        if (user_name != 'null') {
            sessionStorage.setItem('user_name', user_name);
            $('#login-out').show();
            $('#login-in').hide();
            $('#user-name').show().text('Hi,' + user_name);
        } else {
            $('#login-out').hide();
            $('#login-in').show();
            $('#user-name').hide();
        }
        //localStorage.clear();
    }

    //登录信息验证
    $(document).on('submit', '.login form', function () {
        var flag = true;
        if ($('.login #InputEmail').val().trim() == '') {
            $('.login #InputEmail').css('borderColor', 'red');
            $('.login #InputEmail').next().show();
            flag = false;
        } else {
            $('.login #InputEmail').css('borderColor', '');
            $('.login #InputEmail').next().hide();
            flag = true;
        }

        if ($('.login #InputPassword').val().trim() == '') {
            $('.login #InputPassword').css('borderColor', 'red');
            $('.login #InputPassword').next().show();
            flag = false;
        } else {
            $('.login #InputPassword').css('borderColor', '');
            $('.login #InputPassword').next().hide();

            flag = true;
        }

        if (!$('.login #InputRePassword').is(':hidden')) {
            if ($('.login #InputRePassword').val().trim() == '' || $('.login #InputRePassword').val() != $('.login #InputPassword').val()) {
                $('.login #InputRePassword').css('borderColor', 'red');
                $('.login #InputRePassword').next().show().text('请输入确认密码');
                if ($('.login #InputRePassword').val().trim() != '' && $('.login #InputRePassword').val() != $('.login #InputPassword').val())
                    $('.login #InputRePassword').next().text('密码输入不一致');
                flag = false;
            } else {
                $('.login #InputRePassword').css('borderColor', '');
                $('.login #InputRePassword').next().hide();
                flag = true;
            }
        }

        if (!flag) {
            return false;
        } else {
            var user_name = $('.login #InputEmail').val().trim();
            sessionStorage.setItem('user_name', user_name);
            $('#login-out').show();
            $('#login-in').hide();
            $('#user-name').show().text('Hi,' + user_name);
            $(".modal").modal('hide');
            return true;
        }
    })
    //登录界面密码显示隐藏切换
    $(document).on('click', '.password_show', function () {
        if ($(this).prev().attr('type') == 'password') {
            $(this).prev().attr('type', 'text');
        } else {
            $(this).prev().attr('type', 'password');
        }
        ;
    });

    //退出
    $(document).on('click', '#login-out', function () {
        sessionStorage.removeItem('user_name');
        $('#login-out').hide();
        $('#login-in').show();
        $('#user-name').hide();
    })

    //个人信息页面更新
    var url = window.location.pathname;
    if (url.indexOf('order-history') > -1) {
        var user_name = sessionStorage.getItem('user_name');
        $('#login-user-name').text('Hi ' + user_name);
    }


    /**
     * 购物车功能
     */
    //购物篮,购物车加载,增加,删除,更新功能
    function loadCartdata() {
        var collection = localStorage.getItem('cartData');

        if (collection != null) {
            return JSON.parse(collection);
        } else {
            return [];
        }
    }

    function addCartProduct() {
        //localStorage.clear();
        var pid = 'pid_' + parseInt(Math.random() * 10 + 1);
        var img_src = $('.product-picture>img').attr('src');
        var description_title = $('.category-type-title').text();
        var color = $('.detail-color.active').attr('aria-label');
        var size = $('.detail-size.active').text();
        var price = $('.product-detail-price').text();

        var cart = loadCartdata();

        for (var i in cart) {
            if (cart[i].pid == pid) {
                if (color == cart[i]['color'] && size == cart[i]['size'] && img_src == cart[i]['img_src']) {
                    cart[i].qty = parseInt(cart[i].qty) + 1;
                    saveCartData(cart);
                    return;
                }
                pid = 'pid_' + parseInt(Math.random() * 10 + 11);
                break;

            }
        }
        var product = {
            "pid": pid,
            "img_src": img_src,
            "description_title": description_title,
            "description_style": "Ref. 2514/302",
            "color": color,
            "size": size,
            "qty": '1',
            "price": price
        };

        cart.push(product);
        saveCartData(cart);
    }

    function saveCartData(data) {
        localStorage.setItem("cartData", JSON.stringify(data));
    }

    function remove(pid) {
        var cart = loadCartdata();
        for (var index in cart) {
            if (cart[index].pid == pid) {
                break;
            }
        }
        cart.splice(index, 1)[0];
        saveCartData(cart);
    }

    function update(pid, qty) {
        var cart = loadCartdata();
        for (var index in cart) {
            if (cart[index].pid == pid) {
                break;
            }
        }
        var item = cart.splice(index, 1)[0];
        item.qty = parseInt(item.qty) + qty;
        cart.splice(index, 0, item);
        saveCartData(cart);
    }

    function load() {
        var collection = localStorage.getItem("cartData");
        if (collection != null) {
            var cart = JSON.parse(collection);
            $('.table-tbody').html('');
            $('.basket-bag-items').html('');
            for (var i in cart) {
                $('.table-tbody').append(
                    '<div class="table-tbody-row clearfix ' + cart[i].pid + '">' +
                    '   <div class="shopping-cat-table-left">' +
                    '       <div class="shopping-cat-product-img">' +
                    '           <img src="' + cart[i].img_src + '" alt="">' +
                    '       </div>' +
                    '       <div class="shopping-cat-attr clearfix">' +
                    '           <div class="col-md-8 col-sm-12  text-middle">' +
                    '               <div class="shopping-cat-product-description text-middle-content">' +
                    '                   <h1 class="description-title">' + cart[i].description_title + '</h1>' +
                    '                   <p class="description-style">' + cart[i].description_style + '</p>' +
                    '               </div>' +
                    '           </div>' +
                    '           <div class="col-md-2 col-sm-12 text-middle">' +
                    '               <div class="text-middle-content">' +
                    '                   <span class="hidden-md-up">Color: </span>' +
                    '                   <strong class="shopping-cat-product-color">' + cart[i].color + '</strong>' +
                    '               </div>' +
                    '           </div>' +
                    '           <div class="col-md-2 col-sm-12 text-middle">' +
                    '               <div class="text-middle-content">' +
                    '                   <span class="hidden-md-up">Size: </span>' +
                    '                   <strong class="shopping-cat-product-size">' + cart[i].size + '</strong>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="shopping-cat-table-right">' +
                    '       <div class="col-md-4 shopping-cat-product-qty text-middle">' +
                    '           <div class="text-middle-content">' +
                    '               <span class="shopping-cat-product-qty-num ">' + cart[i].qty + '</span>' +
                    '               <div class="btn-group">' +
                    '                   <div class="btn-asc">+</div>' +
                    '                   <div class="btn-desc">-</div>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>' +
                    '       <div class="col-md-4 text-middle">' +
                    '           <div class="shopping-cat-product-price text-middle-content">' +
                    '               €<span>' + cart[i].price.split(" ")[1] + '</span>' +
                    '           </div>' +
                    '       </div>' +
                    '       <div class="col-md-1 pull-right text-center text-middle">' +
                    '           <div class="text-middle-content">' +
                    '               <a class="shopping-cat-product-delete">×</a>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>');
                $('.basket-bag-items').append(
                    '<div class="basket-bag-open-item ' + cart[i].pid + ' clearfix">' +
                    '<div class="col-md-9">' +
                    '<div class="col-md-3 text-middle">' +
                    '<div class="text-middle-content">' +
                    '<img src="' + cart[i].img_src + '" alt="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-9 text-middle p-l-md">' +
                    '<div class="text-middle-content">' +
                    cart[i].description_title +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-3">' +
                    '<div class="col-md-6  text-middle">' +
                    '<div class="text-middle-content">' +
                    '€<span class="basket-bag-open-item-price">' + cart[i].price.split(" ")[1] + '</span>' +
                    '<div>x<span class="basket-bag-open-item-number">' + cart[i].qty + '</span></div>' +

                    '</div>' +
                    '</div>' +
                    '<div class="col-md-1 pull-right text-center text-middle">' +
                    '<div class="text-middle-content">' +
                    '<a class="shopping-cat-product-delete">×</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                );
            }

        }
    }

    //获取对应的class
    function getPid(element) {
        var class_str = element.parents('.table-tbody-row,.basket-bag-open-item').attr('class').split(' ');
        var pid;
        for (var i in class_str) {
            if (class_str[i].indexOf('pid_') > -1) {
                pid = class_str[i];
                return pid;
            }
        }
        return -1;
    }

    //增加当前商品的数量
    $(document).on('click', ".btn-group .btn-asc", function () {
        var shopping_num = parseInt($(this).parents(".text-middle-content").find(".shopping-cat-product-qty-num").text());
        shopping_num = shopping_num + 1;
        var pid = getPid($(this));
        $("." + pid).find(".basket-bag-open-item-number").text(shopping_num);
        $(this).parents(".text-middle-content").find(".shopping-cat-product-qty-num").text(shopping_num);
        Price_refresh();
        update(pid, 1);
    })


    //减少当前商品的数量，如果当前商品数量为1，则删除该商品
    $(document).on('click', ".btn-group .btn-desc", function () {
        var shopping_num = parseInt($(this).parents(".text-middle-content").find(".shopping-cat-product-qty-num").text());
        //alert(shopping_num);
        var pid = getPid($(this));
        if (shopping_num > 1) {
            shopping_num = shopping_num - 1;
            update(pid, -1);
        }

        $("." + pid).find(".basket-bag-open-item-number").text(shopping_num);
        $(this).parents(".text-middle-content").find(".shopping-cat-product-qty-num").text(shopping_num);
        Price_refresh();

    })


    //删除头部购物车商品时同步删除页面列表内商品
    $(document).on('click', '.shopping-cat-product-delete', function () {
        var pid = getPid($(this));
        $("." + pid).remove();
        Price_refresh();
        remove(pid);
    })


    //求当前购物车中商品种类数量
    function shopping_type_num() {
        var t;
        t = $(".basket-bag-open .basket-bag-open-item").size();
        return t;
    }


    //计算当前购物车中商品的总价
    function shopping_total_price() {
        var subtotal = 0.00, shopping_num, total_price = 0.00;
        for (var i = 0; i < shopping_type_num(); i++) {
            shopping_num = parseInt($(".basket-bag-open .basket-bag-open-item").eq(i).find(".basket-bag-open-item-number").text());
            //alert(shopping_num);
            subtotal = parseFloat(rmoney($(".basket-bag-open .basket-bag-open-item").eq(i).find(".basket-bag-open-item-price").text()));
            //alert(subtotal);
            total_price += shopping_num * subtotal;
        }
        //total_price=total_price.toFixed(2);
        return fmoney(total_price, 2);
    }

    //刷新商品总价的函数,即初始化购物车商品总价格
    function Price_refresh() {
        var total_price = shopping_total_price();
        $(".shopping-cat-table .shopping-cat-subtotal-money").text('€' + total_price);
        $(".shopping-cat-payment-content .shopping-cat-subtotal-money").text('€' + total_price);
        $(".shopping-cat-payment-content .shopping-cat-shipping-money").text('€' + 15.00);
        $(".shopping-cat-payment-content .shopping-cat-total-money").text('€' + fmoney(15.00 + rmoney(total_price)));
        $(".basket #basket-count").text(Basket_num());
        $(".basket-bag-open-subtotal .basket-bag-subtotal-money").text('€' + total_price);
    }

    //金额格式化
    function fmoney(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }


    //金额还原成float类型
    function rmoney(s) {
        return parseFloat(s.replace(/[^\d\.-]/g, ""));
    }


    //求当前购物车中商品件数
    function Basket_num() {
        var m = 0;
        for (var i = 0; i < shopping_type_num(); i++) {
            m += parseInt($(".basket-bag-open-item").eq(i).find(".basket-bag-open-item-number").text());
        }
        if (m == 0) {
            $(".empty_bag").show();
        } else {
            $(".empty_bag").hide();
        }
        return m;
    }

    /**
     * 主页面,其他页面布局,事件
     */

        //页面调整
    viewadjust();
    $(window).resize(function () {
        $('.main-content .item>.item-block').height($('.main-content .item').width());
        $('.main-content .item>.item-block').width($('.main-content .item').width());

        $('.carousel-inner').height($('.carousel-inner img').height());

        if ($(window).width() > 767) {
            //index,12宫格商品展示高度和垂直居中效果
            $('.main-content .item>.item-block').eq(0).height($('.main-content .item').width() * 2);
            $('.main-content .item>.item-block').eq(9).height($('.main-content .item').width() * 2);

            /*footer,左边框高度统一*/
            $('footer .col-md-3').css('height', '');
            var max_height = $('footer .col-md-3').eq(0).height();
            for (var i = 1; i < 4; i++) {
                if ($('footer .col-md-3').eq(i).height() > max_height) {
                    max_height = $('footer .col-md-3').eq(i).height();
                }
            }
            $('footer .col-md-3').height(max_height);
            /*footer end*/

            //顶部导航栏宽度限制去除
            $('#navbar').css('width', '');
            //顶部购物篮宽度限制去除
            $('.basket-bag-open').css('width', '');

            //shopping-cart,购物车垂直居中效果
            $('.text-middle').height($('.table-tbody .shopping-cat-product-img').width());
            $('.table-tbody .shopping-cat-product-img').height($('.table-tbody .shopping-cat-product-img').width());
            $('.shopping-cat-subtotal p').css('padding-right', $('.shopping-cat-table-right .text-middle').outerWidth() * 2 + 17 - $('.shopping-cat-subtotal-money').width() - 15 + 'px');
        } else {

            $('footer .col-md-3').css('height', '');

            //顶部导航栏宽度与页面宽度保持一致
            $('#navbar').width($('.navbar').width());

            //顶部购物篮宽度限制去除
            $('.basket-bag-open').width($('.navbar').width() - 42 * 2 - 30);

            //shopping-cart,购物车小屏布局调整
            $('.text-middle').height($('.text-middle').css('height', ''));
            $('.shopping-cat-subtotal p').css('padding-right', '');
            $('.table-tbody .shopping-cat-product-img').height($('.table-tbody .shopping-cat-product-img').parents('.table-tbody-row').height());
        }
        //shopping-cart,购物车垂直居中效果
        $('.table-tbody .shopping-cat-table-right').height($('.table-tbody .table-tbody-row').height() - 20);

    })

    //购物篮打开,关闭事件
    $(document).on("click", 'a#basket-bag', function () {
        $(this).parent().toggleClass('active');
        $('.basket-bag-open').slideToggle(0);
    });

    $(document).on("click", '.basket i', function () {
        $(this).parent().toggleClass('active');
        $('.basket-bag-open').slideToggle(0);
    });

    //搜索框显示
    $(document).on("click", 'a#search-icon', function () {
        $(this).toggleClass('active');
        if (!($('.search input').attr('type') == 'text'))
            $('.search input').attr('type', 'text');
        else {
            if ($('.search input').val().trim() == '') {
                $('.search input').attr('type', 'hidden');
            } else {
                window.location.pathname = "/SH/search-results.html";
            }
        }
    });

    //搜索框,隐藏
    $(document).click(function (e) {
        if (!(e.target == $('a#search-icon')[0] || ($('.search input')[0] == e.target))) {
            $('a#search-icon').removeClass('active');
            $('.search input').attr('type', 'hidden');
        }
    })

    //detail页面,商品缩略图切换
    $(document).on("click", '.product-picture-thum img', function () {
        $('.product-picture>img').attr('src', $(this).attr('src'));
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
    })

    //商品页面,同时选择尺寸和颜色后才可按加入购物车按钮
    function showAddbtn() {
        if ($('.detail-color.active').length > 0 && $('.detail-size.active').length > 0) {
            $('#add-do-cart').removeClass('disabled').addClass('active');
        } else {
            $('#add-do-cart').removeClass('active').addClass('disabled');
        }
    }

    //商品尺寸选择
    $(document).on("click", '.detail-size', function () {
        $(this).toggleClass('active');
        $(this).siblings().removeClass('active');
        showAddbtn();
    })

    //商品颜色选择
    $(document).on("click", '.detail-color', function () {
        $(this).toggleClass('active');
        $(this).siblings().removeClass('active');
        showAddbtn();
    })

    //显示订单结算页面
    $(document).on("click", '.shopping-cat-btn-order', function () {
        $('.shopping-cat-btn').hide();
        $('.order-now').show();
    })

    //商品类别下拉框
    $(document).on("click", '.style-content', function () {
        $(this).next().slideToggle();
        $(this).children('.style-content-right').toggleClass('onshow');
    })
    $(document).on("click", '.style-selection li', function () {
        var text = $(this).text();
        $(this).parent().prev().find('.style-content-left').text(text);
        $(this).parent().slideToggle();
        $(this).parent().prev().find('.style-content-right').toggleClass('onshow');

    })
    //注册链接

    $(document).on('click', '#register', function () {
        $('#InputRePassword').parent().toggle();
        if ($(this).text() == 'I have an account') {
            $(this).text('I don’t have an account')
        } else {
            $(this).text('I have an account')
        }

    })


    //轮播代码
    var interval = 3000;
    var t;

    function carouselStart() {
        var obj = $('.carousel-inner>a:first-child');
        var obj_move = $(obj).width() + 15;
        $('.carousel-inner').animate({
            left: "-=" + obj_move + "px"
        }, function () {
            $(obj).remove();
            $(this).append(obj);
            $(this).css('left', '');
        })
    }

    $(document).on('mouseenter', '.carousel', function () {
        clearInterval(t);
    })
    $(document).on('mouseleave', '.carousel', function () {
        t = setInterval(carouselStart, interval);
    })

    //轮播按键
    $(document).on('click', "a[class*='arrow-']", function (e) {
        var obj = $('.carousel-inner>a:first-child');
        var obj_move = $(obj).width() + 15;

        if (e.target == $('a.arrow-l')[0]) {
            var obj = $('.carousel-inner>a:last-child');
            $(obj).remove();
            $('.carousel-inner').prepend(obj);
            $('.carousel-inner').css('left', -obj_move + 'px');
            $('.carousel-inner').animate({
                left: "+=" + obj_move + "px"
            })
        } else {
            $('.carousel-inner').animate({
                left: "-=" + obj_move + "px"
            }, function () {
                $(obj).remove();
                $(this).append(obj);
                $(this).css('left', '');
            })
        }
    })

    //页面翻页样式
    $(document).on('click', ".pager", function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    })

    //商品加入购物车事件
    $(document).on('click', '#add-do-cart.active', function () {
        addCartProduct();
        load();
        Price_refresh();
    })

    //商品详情页面,detail.html传值
    $(document).on('click', '.category-item', function () {
        var detail_img, detail_title, detail_price;
        detail_img = encodeURIComponent($(this).find('img').attr('src'));
        detail_title = encodeURIComponent($(this).find('.category-item-label').text());
        detail_price = encodeURIComponent($(this).find('.category-item-price').text());

        $(this).attr('href', 'details.html?' + 'detail_img=' + detail_img + '&detail_title=' + detail_title + '&detail_price=' + detail_price);
    })

    if (window.location.href.indexOf('details.html?') > -1) {
        url = decodeURIComponent(window.location.search).split('=');
        var detail_img = url[1].split('&')[0],
            detail_title = url[2].split("&")[0],
            detail_price = url[3];
        $('.product-picture>img').attr('src', detail_img);
        $('.product-picture-thum .active').attr('src', detail_img);
        $('.category-type-title').text(detail_title);
        $('.product-detail-price').text(detail_price);
    }
});
window.onload = function () {
    //轮播图片高度设置
    $('.carousel-inner').height($('.carousel-inner img').height());
    viewadjust();
};