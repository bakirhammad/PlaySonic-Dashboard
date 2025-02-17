import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import {
  DayHeaderContentArg,
  EventClickArg,
} from "@fullcalendar/core/index.js";
import { useMemo, useState } from "react";
import moment from "moment";
import { CustomModal, CustomTable } from "@presentation/components";
import { IReservationData } from "@domain/entities/Reservation/Reservation";
import { CalenderReservationListColumns } from "./CalenderReservationListColumns";
import { CalenderCreateMyReservationForm } from "./CalenderCreateMyReservationForm";

interface IPropsCalendar {
  ReservationData: IReservationData[];
  startTime: string | Date;
  endTime: string | Date;
  courtId: number;
  clubId: number;
  isIndoor: boolean;
}

export const CalendarColors = [
  "green", // Red
  "purple", // Purple
  "blue", // Blue
  "mint", // Mint
  "gray", // Gray
  "orange", // Orange
  "pink", // Pink
  "teal", // Green
  "red", // Teal
];

export const getColorForCourt = (index: number) => {
  // Use modulo to cycle through colors if we have more courts than colors
  return CalendarColors[index % CalendarColors.length];
};

const Calendar = ({
  ReservationData,
  startTime,
  endTime,
  courtId,
  clubId,
  isIndoor,
}: IPropsCalendar) => {
  const columns = useMemo(() => CalenderReservationListColumns, []);
  const [reservationPerDay, setReservaionPerDay] = useState<IReservationData[]>(
    []
  );
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isModalopen, setIsModalOpen] = useState<boolean>(false);
  const [isReservationModal, setIsReservationModal] = useState(false);
  const [clickedReservationDate, setClickedReservationDate] = useState("");
  const [clickedReservationTime, setClickedReservationTime] = useState("");

  const reservationEventData = ReservationData.map((data) => {
    const filterDate = data.reservationDate.split("T").shift();
    const fullStartDate = `${filterDate}T${data.startTime}`;
    const fullEndDate = `${filterDate}T${data.endTime}`;
    return {
      id: data.id,
      backgroundColor:
        courtId !== "All" ? "green" : getColorForCourt(data.courtId),
      title: data.name,
      start: fullStartDate,
      end: fullEndDate,
      extendedProps: {
        numberOfEffect: 1,
        activeRate: [data],
      },
    };
  });

  function handleEventClick(clickInfo: EventClickArg) {
    setReservaionPerDay(clickInfo.event.extendedProps.activeRate);
    setModalTitle(moment(clickInfo.event.start!).format("YYYY-MM-DD"));
    setIsModalOpen(true);
    setIsReservationModal(false);
  }

  function handleDateClick(dateInfo: DateClickArg) {
    const clickedTime = dateInfo.dateStr.split("T");
    const reservationDate = clickedTime[0];
    const reservationTime = clickedTime[1].split("+").shift();
    setClickedReservationDate(reservationDate);
    setClickedReservationTime(reservationTime || "");
    setIsReservationModal(true);
    setIsModalOpen(false);
  }

  return (
    <div className="">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        headerToolbar={{
          left: "prevYear,prev,next,nextYear,today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        initialView="timeGridWeek"
        initialDate={startTime}
        validRange={{
          start: startTime,
          end: endTime,
        }}
        dateClick={(e) => handleDateClick(e)}
        initialEvents={reservationEventData}
        // eventContent={renderEventContent}
        // dayCellContent={renderDayCellContent}
        dayHeaderContent={renderHeaderContent}
        eventClick={(e) => handleEventClick(e)}
        dayHeaderClassNames="border-5 text-light-info"
        dayCellClassNames="border-5"
        eventClassNames="d-block"
        dayMaxEventRows={2}
      />
      {isModalopen && (
        <CustomModal
          modalTitle={modalTitle}
          modalSize={"xl"}
          onClick={() => setIsModalOpen(false)}
        >
          <CustomTable
            withPagination={false}
            columns={columns}
            data={reservationPerDay || []}
          />
        </CustomModal>
      )}
      {isReservationModal && (
        <CustomModal
          modalTitle="Create-Reservation"
          modalSize={"xl"}
          onClick={() => setIsReservationModal(false)}
        >
          <CalenderCreateMyReservationForm
            courtId={courtId}
            reservationDate={clickedReservationDate}
            startTime={clickedReservationTime}
            clubId={clubId}
            isIndoor={isIndoor}
          />
        </CustomModal>
      )}{" "}
      *
    </div>
  );
};

function renderHeaderContent(DayHeaderContentArg: DayHeaderContentArg) {
  return (
    <span>
      <p className=" fw-boldest fs-6 d-block text-center mb-5">
        {DayHeaderContentArg.text}
      </p>
    </span>
  );
}

export default Calendar;
