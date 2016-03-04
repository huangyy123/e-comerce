/**
 * Created by yunpeng on 16/2/26.
 */
$(document).ready(function(){
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
        console.log(shopping_num);
        var pid = getPid($(this));
        console.log(shopping_num);

        $("." + pid).find(".basket-bag-open-item-number").text(shopping_num);
        console.log(shopping_num);

        $(this).parents(".text-middle-content").find(".shopping-cat-product-qty-num").text(shopping_num);
        console.log(shopping_num);

        Price_refresh();
        console.log(shopping_num);

    })


    //减少当前商品的数量，如果当前商品数量为1，则删除该商品
    $(document).on('click', ".btn-group .btn-desc", function () {
        var shopping_num = parseInt($(this).parents(".text-middle-content").find(".shopping-cat-product-qty-num").text());
        //alert(shopping_num);
        console.log(shopping_num);
        if (shopping_num > 1) {
            shopping_num = shopping_num - 1;
        }
        var pid = getPid($(this));
        $("." + pid).find(".basket-bag-open-item-number").text(shopping_num);
        $(this).parents(".text-middle-content").find(".shopping-cat-product-qty-num").text(shopping_num);
        Price_refresh();
    })


    //删除头部购物车商品时同步删除页面列表内商品
    $(document).on('click', '.shopping-cat-product-delete', function () {
        var pid = getPid($(this));
        $("." + pid).remove();
        if (Basket_num() == 0) {
            $(".empty_bag").show();
        }
        Price_refresh();
    })


    //求当前购物车中商品种类数量
    function shopping_type_num() {
        var t;
        t = $(".table-tbody .table-tbody-row").size();
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

    Price_refresh();

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
            m += parseInt($(".table-tbody-row").eq(i).find(".shopping-cat-product-qty-num").text());
        }
        return m;
    }
})
