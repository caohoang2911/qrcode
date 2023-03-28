import SImage from '@/components/MyImage';
import moment from 'moment';
import { useMemo } from 'react';

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
      <div style={{
        textAlign: "center",
        marginTop: "50px"
      }}>
        <div>{orderDetail?.error}</div>
      </div>
    );

  return (
    <div style={{
        fontFamily: "Lato, sans-serif",
        fontSize: "16px",
        lineHeight: "25px" 
    }}>
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "25px 0px"
    }} id="invoice-wp">
      <div
        id="invoice"
        style={{ padding: "15px", width: '452px', border: '1px solid #dfdfdf' }}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}>
              <SImage src="/one-life.png" width="28" height="28" />
              <div style={{
                display: "flex",
                flexDirection: "column"
              }}>
                <span style={{
                  fontSize: "20px",
                  fontWeight: "bold"
                }}>OneLife</span>
                <span>Live it to the fullest</span>
              </div>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }} >
              <span style={{ width: '85%', marginBottom: '10px', textAlign: "center" }}>
                CH: {fullAddress}
              </span>
              <span>
                Mã cửa hàng: {deliveryCode} · Mã NV: {employee?.employeeId || '--'}
              </span>
            </div>
            <div
              style={{ border: "1px dashed #000000", margin: "15px 0px", width: '100%' }}
            ></div>
            <h1 style={{fontSize: "25px", fontWeight: "bold", marginBottom: "12px"}}>HOÁ ĐƠN BÁN HÀNG</h1>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column"
          }}  >
            <span>
              Thời gian: {moment(orderDetail?.header?.orderTime).format('HH:mm DD/MM/YYYY')}
            </span>
            <span>Số HD: OLKFM123456</span>
            <span>Khách hàng: {customer?.name}</span>
            <span>
              SDT: ******
              {customer?.phone?.toString().slice(customer?.phone?.length - 4, customer?.phone)}
            </span>
            <div style={{margin: "15px 0px"}}></div>
            <div
              style={{ border: "1px dashed #000000", margin: "15px 0px", width: '100%' }}
            ></div>
            <div style={{
              display: "flex",
              margin: "10px",
              marginTop: "10px",
            }} >
              <div style={{ width: '50%', fontWeight: "bold"}}>
                Đơn giá
              </div>
              <div style={{ width: '25%', fontWeight: "bold"}}>
                SL
              </div>
              <div style={{ width: '25%', fontWeight: "bold", textAlign: "right"}}>
                Thành tiền
              </div>
            </div>
            {products?.map((product, index) => {
              const { originPrice, sellPrice } = product || {};
              const discount = Math.floor(
                (Number(originPrice) - Number(sellPrice)) / Number(originPrice) / 100
              );
              return (
                <div key={index} style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: '10px 0',
                }}>
                  <div  style={{ width: '100%' }}>
                    {product?.name} {product.unit && `(${product?.unit})`}
                  </div>
                  <div style={{
                    display: "flex"
                  }}>
                    <div style={{ width: '50%' }}>
                      {sellPrice === originPrice && (
                        <span>{new Intl.NumberFormat().format(originPrice) || 0}</span>
                      )}
                      {sellPrice !== originPrice && (
                        <>
                          <span>{new Intl.NumberFormat().format(sellPrice) || 0}</span>
                          {'   '}
                          <span style={{
                            textDecoration: `${sellPrice == originPrice && 'line-through'}`
                          }}>
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
                    <div style={{ width: '25%', textAlign: "right" }}>
                      <span>32,000</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
              style={{ border: "1px dashed #000000", margin: "15px 0px", width: '100%' }}
            ></div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Tổng số lượng:</span>
              <span>{totalProduct}</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Tổng tiền hàng:</span>
              <span>{new Intl.NumberFormat().format(totalPrice) || 0}</span>
            </div>
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Giảm giá hoá đơn:</span>
              <span>--</span>
            </div>
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Phí ship:</span>
              <span>{new Intl.NumberFormat().format(shippingPrice) || 0}</span>
            </div>
          </div>
          <div
              style={{ border: "1px dashed #000000", margin: "15px 0px", width: '100%' }}
            ></div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}>
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Tộng cộng:</span>
              <span>{new Intl.NumberFormat().format(amountCaculator) || 0}</span>
            </div>
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Tiền khách đưa:</span>
              <span>--</span>
            </div>
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <div style={{textAlign: "right"}}>
                <span>Thanh toán bằng điểm (VNĐ):</span>
              </div>
              <div style={{textAlign: "right"}}>
                <span>--</span>
              </div>
            </div>
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <div style={{textAlign: "right"}}>
                <span>Tổng điểm còn lại:</span>
              </div>
              <div style={{textAlign: "right"}}>
                <span>--</span>
              </div>
            </div>
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <div style={{textAlign: "right"}}>
                <span>Thẻ:</span>
              </div>
              <div style={{textAlign: "right"}}>
                <span>--</span>
              </div>
            </div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: '20px'
          }}>
            <div style={{width: "55%"}}>
            <div
              style={{ border: "1px dashed #000000", margin: "15px 0px"}}
            ></div>
            <div
              style={{ border: "1px dashed #000000", margin: "15px 0px"}}
            ></div>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "18px 0px"
            }}>
              <span style={{ fontSize: '20px', fontWeight: "bold" }}>
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
            <div style={{width: "55%"}}>
            <div
              style={{ border: "1px dashed #000000", margin: "15px 0px"}}
            ></div>
            <div
              style={{ border: "1px dashed #000000", margin: "15px 0px"}}
            ></div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 5,
            marginTop: "15px",
            flexDirection: "column",
          }}>
            <span style={{ fontSize: '24px', fontWeight: "bold", textAlign: "center" }}>
              Tải ứng dụng OneLife để sử dụng thẻ ngay hôm nay
            </span>
            <span style={{textAlign: "center"}}>
              Dùng Thẻ OneLife - Kingfoodmart để hưởng <strong>Freeship</strong> và{' '}
              <strong>nhận thêm giá trị Thẻ nạp</strong>
            </span>
          </div>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px"
        }}>
          <SImage src="/qr.jpg" width="158" height="158" />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Invoice;

