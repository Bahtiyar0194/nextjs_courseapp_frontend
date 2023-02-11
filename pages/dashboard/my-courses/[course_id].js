import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineRead, AiOutlineCaretDown, AiOutlineFileText, AiOutlinePlayCircle, AiOutlinePushpin, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { IoGridOutline, IoList } from "react-icons/io5";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import CreateVideoLessonModal from "../../../components/course/CreateVideoLessonModal";
import CreateCourseSectionModal from "../../../components/course/CreateCourseSectionModal";
import API_URL from "../../../config/api";

export default function Course() {
  const router = useRouter();
  const [showFullLoader, setShowFullLoader] = useState(true);
  const intl = useIntl();
  const [videoModal, setVideoModal] = useState(false);
  const [sectionModal, setSectionModal] = useState(false);
  const [course, setCourse] = useState([]);
  const [lessons, setLessons] = useState([]);
  const roles = useSelector((state) => state.authUser.roles);

  let lesson_count = 1;
  let section_count = 1;


  function move(element, direction, course_id) {
    let parent = element.closest('li');
    let wrap = element.closest('ul');

    if (direction == 'up') {
      if (parent.previousElementSibling) {
        wrap.insertBefore(parent, parent.previousElementSibling);
      }
    }
    else if (direction == 'down') {
      if (parent.nextElementSibling) {
        wrap.insertBefore(parent.nextElementSibling, parent);
      }
    }

    let childs = wrap.querySelectorAll("li");
    let newArr = [];
    childs.forEach(function (child) {
      newArr.push(child.getAttribute('data-id'))
    })

    setLessonsOrder(newArr, course_id);
  }

  const setLessonsOrder = async (lessons_id, course_id) => {
    const form_data = new FormData();
    form_data.append('course_id', course_id);
    form_data.append('lessons_id', lessons_id);
    form_data.append('operation_type_id', 4);
    await axios.post('lessons/set_order', form_data)
      .then(response => {
        getLessons(course_id)
      }).catch(err => {
        if (err.response) {
          router.push('/error/' + err.response.status)
        }
        else {
          router.push('/error')
        }
      });
  }

  const getCourse = async (course_id) => {
    setShowFullLoader(true);
    await axios.get('courses/my-courses/' + course_id)
      .then(response => {
        setCourse(response.data)
      }).catch(err => {
        if (err.response) {
          router.push('/error/' + err.response.status)
        }
        else {
          router.push('/error')
        }
      });
  }

  const getLessons = async (course_id) => {
    await axios.get('lessons/my-lessons/' + course_id)
      .then(response => {
        setTimeout(() => {
          setLessons(response.data);
          setShowFullLoader(false);
        }, 500)
      }).catch(err => {
        if (err.response) {
          router.push('/error/' + err.response.status)
        }
        else {
          router.push('/error')
        }
      });
  }

  useEffect(() => {
    if (router.isReady) {
      const { course_id } = router.query;
      getCourse(course_id);
      getLessons(course_id);
    }
  }, [router.isReady]);

  return (
    <DashboardLayout showLoader={showFullLoader} title={course.course_name}>
      <Breadcrumb>
        <Link href={'/dashboard/my-courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
        {course.course_name}
      </Breadcrumb>
      {course.course_id ?
        <>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <div className="bg-active border-active rounded-md sticky top-0">
              <div className="card-bg h-60 p-4 rounded-tl-md rounded-tr-md" style={{ backgroundImage: `url('${API_URL + '/courses/images/posters/' + course.course_poster_file}')` }}>
              </div>
              <div className="p-4">
                <h3>{course.course_name}</h3>
                <p className="text-justify">{course.course_description}</p>
                <hr></hr>
                <p className="text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_category" })}: <span className="font-medium text-corp">{course.course_category_name}</span></p>
                <p className="text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_language" })}: <span className="font-medium text-corp">{course.lang_name}</span></p>
                <div className="flex">
                  {lessons.materials_count > 0 && <p className="text-sm mr-2">{intl.formatMessage({ id: "lesson_materials" })}: <span className="font-medium text-corp">{lessons.materials_count}</span></p>}
                  {lessons.sections_count > 0 && <p className="text-sm">{intl.formatMessage({ id: "lesson_sections" })}: <span className="font-medium text-corp">{lessons.sections_count}</span></p>}
                </div>

                {lessons.total_count == 0 && <h5 className="text-corp">Нет добавленных уроков к данному курсу</h5>}

                {roles.includes(2) &&
                  <div className="flex mt-4">
                    <CDropdown>
                      <CDropdownToggle color="primary" href="#" className="mr-2">
                        {intl.formatMessage({ id: "lesson.add" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <Link href={'#'}><AiOutlineFileText />{intl.formatMessage({ id: "lesson_type.text_content" })}</Link>
                        <Link href={'#'} onClick={() => setVideoModal(true)}><AiOutlinePlayCircle />{intl.formatMessage({ id: "lesson_type.video_lesson" })}</Link>
                        <Link href={'#'} onClick={() => setSectionModal(true)}><AiOutlinePushpin />{intl.formatMessage({ id: "lesson_type.course_section" })}</Link>
                      </CDropdownMenu>
                    </CDropdown>
                  </div>
                }
              </div>
            </div>
          </div>
          {lessons.total_count > 0 ?
            <>
              <div className="col-span-12 md:col-span-6 lg:col-span-8">
                <ul id="lessons_wrap" className="list-group">
                  {lessons.my_lessons?.map(lesson => (
                    <li data-id={lesson.lesson_id} key={lesson.lesson_id} className={lesson.lesson_type_id == 3 ? 'section' : 'lesson'}>
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          {
                            lesson.lesson_type_id == 3
                              ?
                              <h4 className="mb-0">{section_count++} {intl.formatMessage({ id: "section" })}. {lesson.lesson_name}</h4>
                              :
                              <>
                                <Link className="block" href={'/dashboard/lesson/' + lesson.lesson_id}>
                                  <h5 className="mb-1">{lesson.lesson_name}</h5>
                                  <p className="text-active mb-1">{lesson.lesson_description}</p>
                                  <p className="text-xs text-inactive">{lesson.lesson_type_name}</p>
                                </Link>

                              </>
                          }
                        </div>
                        {roles.includes(2) &&
                          <div className="flex items-center pl-1">
                            <button title={intl.formatMessage({ id: "move_up" })} onClick={e => move(e.currentTarget, 'up', course.course_id)} className="btn-up"><AiOutlineArrowUp /></button>
                            <button title={intl.formatMessage({ id: "move_down" })} onClick={e => move(e.currentTarget, 'down', course.course_id)} className="btn-down ml-1"><AiOutlineArrowDown /></button>
                          </div>
                        }
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
            :
            ""
          }
        </>
        :
        <div className="col-span-12">
          {intl.formatMessage({ id: "loading" })}
        </div>
      }

      {roles.includes(2) &&
        <>
          <Modal show={videoModal} onClose={() => setVideoModal(false)} modal_title={intl.formatMessage({ id: "videoLessonModal.title" })} modal_size="modal-xl">
            <CreateVideoLessonModal closeModal={() => setVideoModal(false)} course_id={course.course_id} getLessons={getLessons} />
          </Modal>

          <Modal show={sectionModal} onClose={() => setSectionModal(false)} modal_title={intl.formatMessage({ id: "courseSectionModal.title" })} modal_size="modal-xl">
            <CreateCourseSectionModal closeModal={() => setSectionModal(false)} course_id={course.course_id} getLessons={getLessons} />
          </Modal>
        </>
      }
    </DashboardLayout>
  );
}