import { useDispatch, useSelector } from 'react-redux';
import EmailForm from '../components/widget/EmailForm';
import { changeField, initialize } from '../modules/email';
import { useCallback, useState } from 'react';
import emailjs from '@emailjs/browser';
import { finishLoading, startLoading } from '../modules/loading';
import AskModal from '../components/common/AskModal';
// import { useNavigate } from 'react-router-dom';

export default function EmailContainer() {
  const email = useSelector((state) => {
    return state.email;
  });

  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const onChangeField = useCallback(
    (payload) => {
      dispatch(changeField(payload));
    },
    [dispatch],
  );
  const [reset, setReset] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState({ visible: false, msg: '' });
  const onConfirm = () => {
    setModal1(false);
    dispatch(startLoading('email/EMAIL_SEND'));
    const key = process.env.REACT_APP_EMAIL_KEY;

    emailjs
      .send('service_o7lwk6b', 'template_m3dj4oh', email, {
        publicKey: key,
      })
      .then(
        () => {
          dispatch(initialize());
          dispatch(finishLoading('email/EMAIL_SEND'));
          setModal2({ visible: true, msg: '메일을 보냈습니다.' });
          dispatch(initialize());
          setReset(true);
        },
        (error) => {
          console.log('실패...', error);
          dispatch(finishLoading('email/EMAIL_SEND'));
          setModal2({ visible: true, msg: error });
          dispatch(initialize());
        },
      );

    // setTimeout(() => {
    //   dispatch(finishLoading('email/EMAIL_SEND'));
    //   setModal2({ visible: true, msg: '메일을 보냈습니다.' });
    //   dispatch(initialize());
    //   setReset(true);
    // }, 3000);
  };
  const onSubmit = () => {
    // e.preventDefault();
    setModal1(true);
  };

  // useEffect(() => {
  //   return () => {
  //     dispatch(initialize());
  //   };
  // }, [dispatch]);

  return (
    <div>
      <EmailForm
        onChangeField={onChangeField}
        onSubmit={onSubmit}
        // loading={loading}
        resetForm={reset}
      />
      <AskModal
        visble={modal1}
        description="메일을 보내시겠습니까?"
        cancelTxt="취소"
        confirmTxt="확인"
        onCancel={() => setModal1(false)}
        onConfirm={onConfirm}
        type="confirm"
      />
      <AskModal
        visble={modal2.visible}
        description={modal2.msg}
        cancelTxt="취소"
        confirmTxt="확인"
        onCancel={() => setModal2(false, '')}
        onConfirm={() => setModal2(false, '')}
        type="confirm"
      />
    </div>
  );
}
