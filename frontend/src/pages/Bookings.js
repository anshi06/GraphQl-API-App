import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControls from "../components/Bookings/BookingsControl/BookingsControls";

export default function Bookings() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState('list');
  const context = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
              query {
                bookings {
                  _id
                 createdAt
                 event {
                   _id
                   title
                   date
                   price
                 }
                }
              }
            `,
    };

    await fetch("http://localhost:9000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        setBookings(resData.data.bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  const deleteBookingHandler = (bookingId) => {
    setIsLoading(true);
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!){
            cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
      variables: {
        id: bookingId,
      },
    };

    fetch("http://localhost:9000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedBookings = bookings.filter((booking) => {
          return booking._id !== bookingId;
        });
        setBookings(updatedBookings);
        setIsLoading(false);
        return updatedBookings;
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  const changeOutputTypeHandler = (outputType) => {
    if (outputType === "list") {
      setOutputType("list")
    } else {
      setOutputType("chart")
    }
  };

  const content = isLoading ? (
    <Spinner />
  ) : (
    <>
      <BookingsControls
        activeOutputType={outputType}
        onChange={changeOutputTypeHandler}
      />
      <div>
        {outputType === "list" ? (
          <BookingList
            bookings={bookings}
            onDelete={deleteBookingHandler}
          />
        ) : (
          <BookingsChart bookings={bookings} />
        )}
      </div>
    </>
  );

  return (
    <>
      {content}
    </>
  );
}
