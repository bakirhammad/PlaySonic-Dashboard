import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  DayHeaderContentArg,
  EventClickArg,
} from "@fullcalendar/core/index.js";
import { useMemo, useState } from "react";
import moment from "moment";
import { CustomModal, CustomTable } from "@presentation/components";
import { IReservationData } from "@domain/entities/Reservation/Reservation";
import { ReservationListColumns } from "@presentation/pages/reservation/components/ReservationListColumns";

interface IPropsCalendar {
  ReservationData: IReservationData[];
}
const Calendar = ({ ReservationData }: IPropsCalendar) => {
  const [reservationPerDay, setReservaionPerDay] = useState<IReservationData[]>(
    []
  );
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isModalopen, setIsModalOpen] = useState<boolean>(false);

  // const reservation = useMemo(() => {
  //   let eventGuid = 0;

  //   function createEventId() {
  //     return String(eventGuid++);
  //   }
  //   const dictionary: Record<string, EventInput> = {};
  //   ReservationData.forEach((reservation) => {
  //     const reservationDate = reservation.reservationDate.split("T").shift();

  //     const startDate = moment(
  //       formatFromUtcToLocale(
  //         reservationDate + reservation.startTime,
  //         "YYYY-MM-DD HH:mm"
  //       )
  //     );
  //     const endDate = moment(
  //       formatFromUtcToLocale(
  //         reservationDate + reservation.endTime,
  //         "YYYY-MM-DD HH:mm"
  //       )
  //     );

  //     const currentDate = startDate!.clone();
  //     console.log(startDate, "hhhhhhhhhh", currentDate);
  //     while (currentDate.isSameOrBefore(endDate)) {
  //       const dayOfYear = currentDate.dayOfYear();

  //       if (dictionary[dayOfYear] !== undefined) {
  //         const existingEvent = dictionary[dayOfYear];
  //         const isNewRateMoreRecent = moment(
  //           reservation.reservationDate
  //         ).isAfter(
  //           // moment(existingEvent.extendedProps?.activeRate.creationDateUtc)
  //         );
  //         dictionary[dayOfYear] = {
  //           ...existingEvent,
  //           extendedProps: {
  //             numberOfEffect:
  //               (existingEvent.extendedProps?.numberOfEffect || 0) + 1,
  //             reservation: [
  //               ...(existingEvent.extendedProps?.reservation || []),
  //               reservation,
  //             ],
  //             activeRate: isNewRateMoreRecent
  //               ? reservation
  //               : existingEvent.extendedProps?.activeRate,
  //           },
  //         };
  //       } else {
  //         dictionary[dayOfYear] = {
  //           id: createEventId(),
  //           title: reservation.name,
  //           start: currentDate.toDate(),
  //           extendedProps: {
  //             numberOfEffect: 1,
  //             activeRate: reservation,
  //             reservations: [reservation],
  //           },
  //         };
  //       }
  //       currentDate.add(1, "day");
  //     }
  //   });
  //   return Object.values(dictionary);
  // }, [ReservationData]);

  const reservationEventData = ReservationData.map((data) => {
    const filterDate = data.reservationDate.split("T").shift();
    const fullDate = `${filterDate}T${data.startTime}`;
    return {
      id: data.id,
      backgroundColor: data.status === 1 ? "#4584FF" : "gray",
      title: data.name,
      start: fullDate,
      extendedProps: {
        numberOfEffect: 1,
        activeRate: [data],
      },
    };
  });
  function handleEventClick(clickInfo: EventClickArg) {
  console.log("clajdlf", clickInfo)

    setReservaionPerDay(clickInfo.event.extendedProps.activeRate);
    setModalTitle(moment(clickInfo.event.start!).format("YYYY-MM-DD"));
    setIsModalOpen(true);
  }
  console.log("clajdlf", reservationEventData)

  const columns = useMemo(() => ReservationListColumns, []);
  return (
    <div className="">
      <FullCalendar
        plugins={[dayGridPlugin, multiMonthPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "prevYear,prev,next,nextYear,today",
          center: "title",
          right: "multiMonthYear,dayGridMonth,timeGridWeek",
        }}
        initialView="dayGridMonth"
        initialEvents={reservationEventData}
        // eventContent={renderEventContent}
        // dayCellContent={renderDayCellContent}
        dayHeaderContent={renderHeaderContent}
        eventClick={(e) => handleEventClick(e)}
        dayHeaderClassNames="border-5 text-light-info"
        dayCellClassNames="border-5"
        eventClassNames="d-block"
        dayMaxEventRows={1}
      />
      {isModalopen && (
        <CustomModal
          modalTitle={modalTitle}
          modalSize={"xl"}
          onClick={() => setIsModalOpen(false)}
        >
          <CustomTable columns={columns} data={reservationPerDay || []} />

          {/* <ReservaionsDetailsAffectingOnDay reservationPerDay={reservationPerDay} /> */}
        </CustomModal>
      )}
    </div>
  );
};

function renderHeaderContent(DayHeaderContentArg: DayHeaderContentArg) {
  return (
    <span>
      <b className=" fw-boldest fs-6 d-block text-center mb-5">
        {DayHeaderContentArg.text}
      </b>
    </span>
  );
}

// function renderEventContent(eventInfo: EventContentArg) {
//   const roomCategoryRateArray = [
//     { cost: "single", title: "Single" },
//     { cost: "double", title: "Double" },
//     { cost:"triple", title: "Triple" },
//     { cost: "quadruple", title: "Quadruple" },
//     { cost: "quintuple", title: "Quintuple" },
//   ];
//   return (
//     <div className="d-flex flex-column w-full p-2">
//       <div className="d-flex justify-content-between align-items-center mb-5  w-full p-2">
//         <b className="text-muted fw-semibold d-block text-center">
//           {eventInfo.event.title}
//         </b>
//         <button
//           className="badge badge-secondary btn p-2 rounded align-self-center"
//           data-bs-toggle="tooltip"
//           data-bs-trigger="hover"
//           title="Number of reservation affecting on this day "
//         >
//           {eventInfo.event.extendedProps.numberOfEffect}
//         </button>
//       </div>
//       <div className="row row-cols-1 row-cols-md-2 ">
//         {roomCategoryRateArray.map(({ cost, title }, index) => (
//           <div key={index} className="d-flex align-items-center gap-5 ">
//             <span className="bullet bullet-vertical h-30px bg-primary"></span>
//             <div className="flex-grow-1">
//               <span className="text-muted fw-semibold d-block">{title}</span>
//               <a
//                 href="#"
//                 className="text-gray-800 text-hover-primary fw-bold fs-6"
//               >
//                 {cost}
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export default Calendar;
