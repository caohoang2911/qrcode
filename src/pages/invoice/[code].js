import React, { useEffect, useMemo, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import moment from 'moment';
import SImage  from '@/components/MyImage';

export async function getServerSideProps(context) {
  // Fetch data from external API
  const { query } = context;
  const { code } = query;

  const res = await fetch(`https://oms-api-dev.seedcom.me/share/getOrderDetail?companyKey=uifTjoY24DRGWz3NjcVa7w&orderCode=${code}`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

const Invoice = ({ data }) => {
  const orderDetail = data?.data;
  const { header } = orderDetail || {}

  const { customer, employee } = header || {};
  const { products, shippingPrice, shippingDiscount } = orderDetail?.deliveries?.[0] || {};
  const { fullAddress , code: deliveryCode } = orderDetail?.deliveries?.[0]?.store || {};

  const totalProduct = useMemo(() => {
    return Math.round(
      products?.reduce(
        (previousValue, currentValue) => previousValue + currentValue.quantity,
        0
      )
    );
  }, [products]);

  const totalPrice = useMemo(() => {
    return products?.reduce(
      (previousValue, currentValue) =>
        previousValue + Number(currentValue.sellPrice || 0) * Number(currentValue.quantity || 0),
      0
    );
  }, [products]);

  const amountCaculator = useMemo(() => {
    return Number(totalPrice) + Number(shippingPrice || 0) - Number(shippingDiscount);
  }, [shippingDiscount, shippingPrice, totalPrice]);

  // if (isLoading) return <Loading />;

  if (orderDetail?.error)
    return (
      <div className="text-center mt-5">
        <div>{orderDetail?.error}</div>
      </div>
    );

  return (
    <>
    <div className="flex flex-col justify-center items-center py-10" id="invoice-wp">
      <div
        className="p-5 border"
        id="invoice"
        style={{ width: '452px', border: '1px solid #dfdfdf' }}
      >
        <div className="head flex flex-col justify-center ">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <SImage src="/one-life.png" width="28" height="28" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">OneLife</span>
                <span>Live it to the fullest</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-center" style={{ width: '85%' }}>
                CH: {fullAddress}
              </span>
              <span>
                Mã cửa hàng: {deliveryCode} · Mã NV: {employee?.employeeId || '--'}
              </span>
            </div>
            <div
              className="border border-dashed my-3"
              style={{ borderColor: '#000000', width: '100%' }}
            ></div>
            <h1 className="font-bold mb-3" style={{fontSize: "25px"}}>HOÁ ĐƠN BÁN HÀNG</h1>
          </div>
          <div className="flex flex-col">
            <span>
              Thời gian: {moment(orderDetail?.header?.orderTime).format('HH:mm DD/MM/YYYY')}
            </span>
            <span>Số HD: OLKFM123456</span>
            <span>Khách hàng: {customer?.name}</span>
            <span>
              SDT: ******
              {customer?.phone?.toString().slice(customer?.phone?.length - 4, customer?.phone)}
            </span>
            <div className="my-2"></div>
            <div
              className="border border-dashed w-100 my-3"
              style={{ borderColor: '#000000' }}
            ></div>
            <div className="flex py-2 mt-2">
              <div className="font-bold" style={{ width: '50%' }}>
                Đơn giá
              </div>
              <div className="font-bold" style={{ width: '25%' }}>
                SL
              </div>
              <div className="font-bold text-right" style={{ width: '25%' }}>
                Thành tiền
              </div>
            </div>
            {products?.map((product, index) => {
              const { originPrice, sellPrice } = product || {};
              const discount = Math.floor(
                (Number(originPrice) - Number(sellPrice)) / Number(originPrice) / 100
              );
              return (
                <div key={index} className="flex flex-col py-2">
                  <div className="uppercase" style={{ width: '100%' }}>
                    {product?.name} {product.unit && `(${product?.unit})`}
                  </div>
                  <div className="flex">
                    <div style={{ width: '50%' }}>
                      {sellPrice === originPrice && (
                        <span>{new Intl.NumberFormat().format(originPrice) || 0}</span>
                      )}
                      {sellPrice !== originPrice && (
                        <>
                          <span>{new Intl.NumberFormat().format(sellPrice) || 0}</span>
                          {'   '}
                          <span className={`${sellPrice == originPrice && 'line-through'}`}>
                            {new Intl.NumberFormat().format(originPrice) || 0}
                          </span>
                        </>
                      )}
                      {Boolean(discount) && (
                        <>
                          {'  '}
                          <span>{discount}</span>
                        </>
                      )}
                    </div>
                    <div style={{ width: '25%' }}>{product?.quantity}</div>
                    <div className="text-right" style={{ width: '25%' }}>
                      <span>32,000</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border border-dashed w-100 my-3" style={{ borderColor: '#000000' }}></div>
          <div className="flex flex-col items-between">
            <div className="flex justify-between">
              <span>Tổng số lượng:</span>
              <span>{totalProduct}</span>
            </div>
            <div className="flex justify-between">
              <span>Tổng tiền hàng:</span>
              <span>{new Intl.NumberFormat().format(totalPrice) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá hoá đơn:</span>
              <span>--</span>
            </div>
            <div className="flex justify-between">
              <span>Phí ship:</span>
              <span>{new Intl.NumberFormat().format(shippingPrice) || 0}</span>
            </div>
          </div>
          <div className="border border-dashed w-100 my-3" style={{ borderColor: '#000000' }}></div>
          <div className="flex flex-col items-between">
            <div className="flex justify-between">
              <span>Tộng cộng:</span>
              <span>{new Intl.NumberFormat().format(amountCaculator) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Tiền khách đưa:</span>
              <span>--</span>
            </div>
            <div className="flex justify-between">
              <div className="text-right">
                <span>Thanh toán bằng điểm (VNĐ):</span>
              </div>
              <div className="text-right">
                <span>--</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-right">
                <span>Tổng điểm còn lại:</span>
              </div>
              <div className="text-right">
                <span>--</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-right">
                <span>Thẻ:</span>
              </div>
              <div className="text-right">
                <span>--</span>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-col mt-5">
            <div className="w-1/2">
              <div
                className="border border-dashed w-100 mb-2"
                style={{ borderColor: '#000000' }}
              ></div>

              <div className="border border-dashed w-100" style={{ borderColor: '#000000' }}></div>
            </div>
            <div className="my-4 flex flex-col items-center">
              <span style={{ fontSize: '20px' }} className="font-bold">
                YÊU CẦU HỖ TRỢ
              </span>
              <span>
                <span>Liên hệ </span>
                <strong>1800 6804</strong>
              </span>
              <span>
                (<strong>7:00 - 21:00</strong> · Trừ CN và ngày lễ)
              </span>
            </div>
            <div className="w-1/2">
              <div
                className="border border-dashed w-100 mb-2"
                style={{ borderColor: '#000000' }}
              ></div>

              <div className="border border-dashed w-100" style={{ borderColor: '#000000' }}></div>
            </div>
          </div>

          <div className="footer flex gap-1 pt-3 mt-5 flex-col items-center">
            <span className="font-bold text-center" style={{ fontSize: '24px' }}>
              Tải ứng dụng OneLife để sử dụng thẻ ngay hôm nay
            </span>
            <span className="text-center">
              Dùng Thẻ OneLife - Kingfoodmart để hưởng <strong>Freeship</strong> và{' '}
              <strong>nhận thêm giá trị Thẻ nạp</strong>
            </span>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <SImage src="/qr.jpg" width="158" height="158" />
        </div>
      </div>
    </div>
    </>
  );
};

export default Invoice;

