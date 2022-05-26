import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

export default function ChatPanel({ onSelect, userName, roomName }) {
  const [messages, setMessages] = useState([]);

  // Custom hook useInterval will take an action on a set time interval
  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useInterval(() => {
    getMessages();
  }, 1000);

  const getMessages = () => {
    axios
      .get(`https://studeecloud-server.herokuapp.com/messages/${roomName}`)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="dashboard__panel relative border pb-1 bg-meringue">
      <button
        type="button"
        className="absolute"
        style={{ top: '3.5%', right: '2%' }}
        onClick={onSelect}
      >
        <FontAwesomeIcon icon={solid('expand')} className="h-7" />
      </button>

      <h1 className="mt-2 mb-3 font-display text-4xl text-teal text-center">
        Chat
      </h1>
      <article className="flex flex-col justify-between border w-5/6 mx-auto bg-gold p-2 rounded h-5/6">
        <div className="flex flex-col-reverse overflow-auto">
          <MessageList messages={messages} />
        </div>
        <MessageForm
          getMessages={getMessages}
          userName={userName}
          roomName={roomName}
        />
      </article>
    </section>
  );
}
