import DashboardLayout from "../../../components/layouts/DashboardLayout";
import parse from 'html-react-parser';
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import DeleteLessonModal from "../../../components/lesson/DeleteLessonModal";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineCaretDown, AiOutlineFileText, AiOutlinePushpin, AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineEdit, AiOutlineDelete, AiOutlineStar, AiFillStar } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import CreateCourseSectionModal from "../../../components/lesson/CreateCourseSectionModal";
import EditSectionModal from "../../../components/lesson/EditSectionModal";
import BuyCourseModal from "../../../components/lesson/BuyCourseModal";
import SubscribersModal from "../../../components/lesson/SubscribersModal";
import { scrollIntoView } from "seamless-scroll-polyfill";
import StickyBox from "react-sticky-box";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import RoleProvider from "../../../services/RoleProvider";
import CourseCard from "../../../components/course/CourseCard";

export default function Course() {
  const router = useRouter();
  const [showFullLoader, setShowFullLoader] = useState(true);
  const intl = useIntl();
  const [sectionModal, setSectionModal] = useState(false);
  const [buyCourseModal, setBuyCourseModal] = useState(false);
  const [subscribersModal, setSubscribersModal] = useState(false);
  const [edit_section_id, setEditSectionId] = useState('');
  const [section_name, setSectionName] = useState('');
  const [edit_section_modal, setEditSectionModal] = useState(false);
  const [delete_lesson_modal, setDeleteLessonModal] = useState(false);
  const [delete_lesson_id, setDeleteLessonId] = useState('');
  const [course, setCourse] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [animateParent, enableAnimations] = useAutoAnimate();

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
          router.push({
            pathname: '/error',
            query: {
              status: err.response.status,
              message: err.response.data.message,
              url: err.request.responseURL,
            }
          });
        }
        else {
          router.push('/error');
        }
      });
  }

  const getCourse = async (course_id) => {
    await axios.get('courses/my-courses/' + course_id)
      .then(response => {
        setCourse(response.data);
      }).catch(err => {
        if (err.response) {
          router.push({
            pathname: '/error',
            query: {
              status: err.response.status,
              message: err.response.data.message,
              url: err.request.responseURL,
            }
          });
        }
        else {
          router.push('/error');
        }
      });
  }

  const getLessons = async (course_id) => {
    await axios.get('lessons/my-lessons/' + course_id)
      .then(response => {
        setTimeout(() => {
          setShowFullLoader(false);
          setLessons(response.data);
        }, 500)
      }).catch(err => {
        if (err.response) {
          router.push({
            pathname: '/error',
            query: {
              status: err.response.status,
              message: err.response.data.message,
              url: err.request.responseURL,
            }
          });
        }
        else {
          router.push('/error');
        }
      });
  }

  const editLesson = (lesson_id, lesson_type_id, lesson_name) => {
    if (lesson_type_id == 2) {
      setEditSectionId(lesson_id);
      setSectionName(lesson_name);
      setEditSectionModal(true);
    }
    else {
      router.push('/dashboard/lesson/edit/' + lesson_id)
    }
  }

  const deleteLesson = (lesson_id) => {
    setDeleteLessonId(lesson_id);
    setDeleteLessonModal(true);
  }

  useEffect(() => {
    if (router.isReady) {
      const { course_id } = router.query;
      setShowFullLoader(true);
      getCourse(course_id);
      getLessons(course_id);
    }
  }, [router.isReady]);

  return (
    <DashboardLayout showLoader={showFullLoader} title={course.course_name}>
      {course.course_id ?
        <>
          <Breadcrumb>
            {course.subscribed == true
              ?
              <Link href={'/dashboard/courses/my-courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
              :
              <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
            }
            {course.course_name}
          </Breadcrumb>

          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="custom-grid">
              <div className="col-span-12">
                <h2>{course.course_name}</h2>
              </div>
              <div className="col-span-12">
                <div className="flex flex-wrap gap-4 md:gap-8">
                  <div className="flex gap-4 md:gap-6">
                    <div className="w-16 h-16 rounded-full border-active flex justify-center items-center">
                      <div className="w-14 h-14 rounded-full bg-corp flex justify-center items-center">
                        КБ
                      </div>
                    </div>
                    <div className="pt-1">
                      <p className="text-inactive mb-0">{intl.formatMessage({ id: "page.my_courses.form.course_author" })}:</p>
                      <p className="font-medium text-corp text-lg mb-0">{course.last_name} {course.first_name}</p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="text-inactive mb-0">{intl.formatMessage({ id: "page.my_courses.form.course_category" })}:</p>
                    <p className="font-medium text-corp text-lg mb-0">{course.course_category_name}</p>
                  </div>
                  <div className="pt-1">
                    <p className="text-inactive mb-0">{intl.formatMessage({ id: "page.my_courses.form.course_language" })}:</p>
                    <p className="font-medium text-corp text-lg mb-0">{course.lang_name}</p>
                  </div>
                  <div className="pt-1">
                    <p className="text-inactive mb-0">{intl.formatMessage({ id: "page.my_courses.form.course_level" })}:</p>
                    <p className="font-medium text-corp text-lg mb-0">{course.level_type_name}</p>
                  </div>
                  <div className="pt-1">
                    <p className="text-inactive mb-0">{intl.formatMessage({ id: "rating" })}:</p>
                    <div className="flex gap-0.5 mt-1 text-yellow-500 text-xl">
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiOutlineStar className="text-inactive" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <h3>{intl.formatMessage({ id: "page.my_courses.form.course_description" })}</h3>
                <p className="font-medium">{course.course_description}</p>
              </div>

              <div className="col-span-12">
                <h3>{intl.formatMessage({ id: "page.my_courses.form.course_content" })}</h3>
                {parse(course.course_content)}
              </div>

              {course.skills?.length > 0 &&
                <div className="col-span-12">
                  <h3>{intl.formatMessage({ id: "page.my_courses.form.what_skills_will_this_course_provide" })}</h3>
                  <div className="flex flex-wrap gap-4">
                    {course.skills?.map(skill => (
                      <div key={skill.id} className="badge badge-outline-primary">
                        {skill.skill_name}
                      </div>
                    ))}
                  </div>
                </div>
              }

              {course.subscribed == true &&
                <div className="col-span-12">
                  <div className="flex justify-between">
                    <h3 className="mb-0 max-lg:mb-4">{intl.formatMessage({ id: "lessons" })}</h3>
                    <RoleProvider roles={[2]}>
                      <div className="btn-wrap">
                        <CDropdown>
                          <CDropdownToggle color="primary" href="#">
                            {intl.formatMessage({ id: "lesson.add" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <Link href={'/dashboard/lesson/create/' + course.course_id}><AiOutlineFileText />{intl.formatMessage({ id: "lesson.add_lesson" })}</Link>
                            <Link href={'#'} onClick={() => setSectionModal(true)}><AiOutlinePushpin />{intl.formatMessage({ id: "lesson_type.course_section" })}</Link>
                          </CDropdownMenu>
                        </CDropdown>
                      </div>
                    </RoleProvider>
                  </div>

                  {
                    lessons.total_count > 0 ?
                      <ul id="lessons_wrap" className="list-group mt-4" ref={animateParent}>
                        {lessons.my_lessons?.map(lesson => (
                          <li data-id={lesson.lesson_id} key={lesson.lesson_id} className={lesson.lesson_type_id == 2 ? 'section' : 'lesson'}>
                            {
                              lesson.lesson_type_id == 2
                                ?
                                <h4 className="mb-0">{section_count++} {intl.formatMessage({ id: "section" })}. {lesson.lesson_name}</h4>
                                :
                                <Link className="block" href={'/dashboard/lesson/' + lesson.lesson_id}>
                                  <h5 className="mb-1">{lesson.lesson_name}</h5>
                                  <p className="text-active mb-2">{lesson.lesson_description.substring(0, 200)}{lesson.lesson_description.length > 200 && '...'}</p>

                                  {lesson.tasks_count > 0 && <span className="badge badge-outline-primary">{intl.formatMessage({ id: "tasks" })}: {lesson.tasks_count}</span>}
                                  {lesson.views_count > 0 && <span className="badge badge-light">{intl.formatMessage({ id: "views" })}: {lesson.views_count}</span>}
                                </Link>
                            }

                            <RoleProvider roles={[2]}>
                              <div className="btn-wrap mt-4">
                                <button title={intl.formatMessage({ id: "edit" })} onClick={e => editLesson(lesson.lesson_id, lesson.lesson_type_id, lesson.lesson_name)} className="btn-edit"><AiOutlineEdit /></button>
                                <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteLesson(lesson.lesson_id)} className="btn-delete"><AiOutlineDelete /></button>
                                <button title={intl.formatMessage({ id: "move_up" })} onClick={e => move(e.currentTarget, 'up', course.course_id)} className="btn-up"><AiOutlineArrowUp /></button>
                                <button title={intl.formatMessage({ id: "move_down" })} onClick={e => move(e.currentTarget, 'down', course.course_id)} className="btn-down"><AiOutlineArrowDown /></button>
                              </div>
                            </RoleProvider>

                          </li>
                        ))}
                      </ul>
                      :
                      <p className="text-inactive">{intl.formatMessage({ id: "no_added_lessons" })}</p>
                  }
                </div>
              }
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 max-md:hidden lg:col-span-3">
            <StickyBox offsetTop={6} offsetBottom={6}>
              <CourseCard course={course} lessons={lessons} getCourse={getCourse} getLessons={getLessons} setSubscribersModal={setSubscribersModal} />
            </StickyBox>
          </div>
        </>
        :
        <div className="col-span-12">
          {intl.formatMessage({ id: "loading" })}
        </div>
      }


      <RoleProvider roles={[2]}>
        <Modal show={sectionModal} onClose={() => setSectionModal(false)} modal_title={intl.formatMessage({ id: "courseSectionModal.title" })} modal_size="modal-xl">
          <CreateCourseSectionModal closeModal={() => setSectionModal(false)} course_id={course.course_id} getLessons={getLessons} />
        </Modal>

        <Modal show={edit_section_modal} onClose={() => setEditSectionModal(false)} modal_title={intl.formatMessage({ id: "edit.courseSectionModal.title" })} modal_size="modal-xl">
          <EditSectionModal course_id={course.course_id} edit_section_id={edit_section_id} setSectionName={setSectionName} section_name={section_name} getLessons={getLessons} closeModal={() => setEditSectionModal(false)} />
        </Modal>

        <Modal show={delete_lesson_modal} onClose={() => setDeleteLessonModal(false)} modal_title={intl.formatMessage({ id: "lesson.deleteLessonModal.title" })} modal_size="modal-xl">
          <DeleteLessonModal course_id={course.course_id} delete_lesson_id={delete_lesson_id} redirect={false} getLessons={getLessons} closeModal={() => setDeleteLessonModal(false)} />
        </Modal>

        <Modal show={subscribersModal} onClose={() => setSubscribersModal(false)} modal_title={intl.formatMessage({ id: "page.courses.subscribersModal.title" })} modal_size="modal-6xl">
          <SubscribersModal subscribers={course.subscribers} closeModal={() => setSubscribersModal(false)} />
        </Modal>
      </RoleProvider>


      <Modal show={buyCourseModal} onClose={() => setBuyCourseModal(false)} modal_title={intl.formatMessage({ id: "courseSectionModal.title" })} modal_size="modal-xl">
        <BuyCourseModal closeModal={() => setBuyCourseModal(false)} course_id={course.course_id} getLessons={getLessons} />
      </Modal>

    </DashboardLayout>
  );
}