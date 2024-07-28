import "./UserDetails.css";

interface ContactsProps {
  data: any;
}

const Contacts: React.FC<ContactsProps> = ({ data }) => {
  return (
    <div className="ion-padding">
      {data?.first_name && (
        <div>
          <div className="label-detail">
            <div className="label">Phone</div>
            <div className="detail">
              <a href={`tel:${data?.phone}`}>
                {data?.phone}
              </a>
            </div>
          </div>
          <div className="label-detail">
            <div className="label">Email</div>
            <div className="detail">
              <a href={`mailto:${data?.email}`}>
                {data?.email}
              </a>
            </div>
          </div>
        </div>
      )}
      {/* {data?.listing_agent?.name && (
        <>
          <div className="ion-margin-top"></div>
          <div className="ion-margin-top">
            <div className="label-detail">
              <div className="label">Name (Listing Agent)</div>
              <div className="detail">{data?.listing_agent?.name}</div>
            </div>
            <div className="label-detail">
              <div className="label">Phone</div>
              <div className="detail">
                <a href={`tel:${data?.listing_agent?.phone}`}>
                  {data?.listing_agent?.phone}
                </a>
              </div>
            </div>
            <div className="label-detail">
              <div className="label">Email</div>
              <div className="detail">
                <a href={`mailto:${data?.listing_agent?.email}`}>
                  {data?.listing_agent?.email}
                </a>
              </div>
            </div>
          </div>
        </>
      )} */}
    </div>
  );
};

export default Contacts;
