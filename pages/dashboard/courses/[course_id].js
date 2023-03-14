import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineCaretDown, AiOutlineFileText, AiOutlinePushpin, AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import CreateCourseSectionModal from "../../../components/lesson/CreateCourseSectionModal";
import API_URL from "../../../config/api";
import { scrollIntoView } from "seamless-scroll-polyfill";

export default function Course() {
  const router = useRouter();
  const [showFullLoader, setShowFullLoader] = useState(true);
  const intl = useIntl();
  const [sectionModal, setSectionModal] = useState(false);
  const [course, setCourse] = useState([]);
  const [lessons, setLessons] = useState([]);
  const roles = useSelector((state) => state.authUser.roles);

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

    scrollIntoView(parent, { behavior: "smooth", block: "center", inline: "center" });

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
    form_data.append('operation_type_id', 5);
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
      {course.course_id ?
        <>
          <Breadcrumb>
            <Link href={'/dashboard/courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
            {course.course_name}
          </Breadcrumb>
          <div className="col-span-12 lg:col-span-5">
            <img className="w-full rounded-md" src={API_URL + '/courses/images/posters/' + course.course_poster_file} />
          </div>

          <div className="col-span-12 lg:col-span-7">
            <h2>{course.course_name}</h2>
            <p className="text-justify">{course.course_description}</p>
            <hr></hr>
            <p className="text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_category" })}: <span className="font-medium text-corp">{course.course_category_name}</span></p>
            <p className="text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_language" })}: <span className="font-medium text-corp">{course.lang_name}</span></p>
            <div className="flex">
              {lessons.materials_count > 0 && <p className="text-sm mr-2">{intl.formatMessage({ id: "lesson_materials" })}: <span className="font-medium text-corp">{lessons.materials_count}</span></p>}
              {lessons.sections_count > 0 && <p className="text-sm">{intl.formatMessage({ id: "lesson_sections" })}: <span className="font-medium text-corp">{lessons.sections_count}</span></p>}
            </div>
          </div>

          <div className="col-span-12">
            <div className="flex max-sm:flex-col sm:justify-between sm:items-center">
              <h3 className="mb-0 max-lg:mb-4">{intl.formatMessage({ id: "lessons" })}</h3>
              {roles.includes(2) &&
                <CDropdown>
                  <CDropdownToggle color="primary" href="#">
                    {intl.formatMessage({ id: "lesson.add" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <Link href={'/dashboard/lesson/create/' + course.course_id}><AiOutlineFileText />{intl.formatMessage({ id: "lesson.add_lesson" })}</Link>
                    <Link href={'#'} onClick={() => setSectionModal(true)}><AiOutlinePushpin />{intl.formatMessage({ id: "lesson_type.course_section" })}</Link>
                  </CDropdownMenu>
                </CDropdown>
              }
            </div>

            {
              lessons.total_count > 0 ?
                <ul id="lessons_wrap" className="list-group mt-4">
                  {lessons.my_lessons?.map(lesson => (
                    <li data-id={lesson.lesson_id} key={lesson.lesson_id} className={lesson.lesson_type_id == 3 ? 'section' : 'lesson'}>
                      {
                        lesson.lesson_type_id == 2
                          ?
                          <h4 className="mb-0">{section_count++} {intl.formatMessage({ id: "section" })}. {lesson.lesson_name}</h4>
                          :
                          <>
                            <Link className="block" href={'/dashboard/lesson/' + lesson.lesson_id}>
                              <h5 className="mb-1">{lesson.lesson_name}</h5>
                              <p className="text-active mb-2">{lesson.lesson_description.substring(0, 200)}{lesson.lesson_description.length > 200 && '...'}</p>
                              <span className="badge badge-light">{lesson.lesson_type_name}</span>
                            </Link>
                          </>
                      }
                      {roles.includes(2) && lessons.total_count > 0 &&
                        <div className="btn-wrap mt-4">
                          {
                            lesson.lesson_type_id == 1 && <Link title={intl.formatMessage({ id: "edit" })} href={'/dashboard/lesson/edit/' + lesson.lesson_id} className="btn-edit"><AiOutlineEdit /></Link>
                          }
                          <button title={intl.formatMessage({ id: "move_up" })} onClick={e => move(e.currentTarget, 'up', course.course_id)} className="btn-up"><AiOutlineArrowUp /></button>
                          <button title={intl.formatMessage({ id: "move_down" })} onClick={e => move(e.currentTarget, 'down', course.course_id)} className="btn-down"><AiOutlineArrowDown /></button>
                        </div>
                      }
                    </li>
                  ))}
                </ul>
                : <p className="text-inactive">{intl.formatMessage({ id: "no_added_lessons" })}</p>
            }
          </div>
        </>
        :
        <div className="col-span-12">
          {intl.formatMessage({ id: "loading" })}
        </div>
      }

      {roles.includes(2) &&
        <>
          <Modal show={sectionModal} onClose={() => setSectionModal(false)} modal_title={intl.formatMessage({ id: "courseSectionModal.title" })} modal_size="modal-xl">
            <CreateCourseSectionModal closeModal={() => setSectionModal(false)} course_id={course.course_id} getLessons={getLessons} />
          </Modal>
        </>
      }
    </DashboardLayout>
  );
}