import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineRead, AiOutlineCaretDown, AiOutlineFileText, AiOutlinePlayCircle } from "react-icons/ai";
import { IoGridOutline, IoList } from "react-icons/io5";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import CreateVideoLessonModal from "../../../components/course/CreateVideoLessonModal";

export default function Course() {
  const API_URL = process.env.NODE_ENV === 'development' ? process.env.DEV_API : process.env.PROD_API;
  const router = useRouter();
  const [showFullLoader, setShowFullLoader] = useState(true);
  const intl = useIntl();
  const [videoModal, setVideoModal] = useState(false);
  const [course, setCourse] = useState([]);

  let i = 1;

  const getCourse = async (course_id) => {
    setShowFullLoader(true);
    await axios.get('courses/my-courses/' + course_id)
      .then(response => {
        setTimeout(() => {
          setCourse(response.data)
          setShowFullLoader(false);
        }, 500)
      }).catch(error => {
        setLoader(false);
      });
  }

  useEffect(() => {
    if (router.isReady) {
      const { course_id } = router.query;
      getCourse(course_id);
    }
  }, [router.isReady]);

  return (
    <DashboardLayout showLoader={showFullLoader} title={course.course_name}>
      <Breadcrumb><Link href={'/dashboard/my-courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link> / {course.course_name}</Breadcrumb>
      {course.course_id ?
        <>
          <div className="col-span-12 md:col-span-4">
            <img className="w-full rounded-lg" src={API_URL + '/courses/images/posters/' + course.course_poster_file} />
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2>{course.course_name}</h2>
            <p className="text-justify">{course.course_description}</p>


            <div className="flex mt-4">
              <CDropdown>
                <CDropdownToggle color="primary" href="#" className="mr-2">
                  {intl.formatMessage({ id: "lesson.add_material" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <Link href={'#'}><AiOutlineFileText />{intl.formatMessage({ id: "lesson_type.text_content" })}</Link>
                  <Link href={'#'} onClick={() => setVideoModal(true)}><AiOutlinePlayCircle />{intl.formatMessage({ id: "lesson_type.video_lesson" })}</Link>
                </CDropdownMenu>
              </CDropdown>


              <button onClick={() => setLessonModal(true)} className="btn btn-outline-primary"><AiOutlineRead />
                <span>Редактировать</span>
              </button>
            </div>
          </div>
        </>
        :
        <div className="col-span-12">
          {intl.formatMessage({ id: "loading" })}
        </div>
      }

      <Modal show={videoModal} onClose={() => setVideoModal(false)} modal_title={intl.formatMessage({ id: "videoLessonModal.title" })} modal_size="modal-xl">
        <CreateVideoLessonModal course_id={course.course_id} />
      </Modal>

    </DashboardLayout>
  );
}