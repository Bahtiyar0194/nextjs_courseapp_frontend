import DashboardLayout from "../../../components/layouts/DashboardLayout";
import parse from 'html-react-parser';
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import DeleteLessonModal from "../../../components/lesson/DeleteLessonModal";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineCaretDown, AiOutlineFileText, AiOutlinePushpin, AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineEdit, AiOutlineDelete, AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
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
import RatingStars from "../../../components/ui/RatingStars";
import ReviewForm from "../../../components/ui/ReviewForm";
import ReviewsList from "../../../components/ui/ReviewsList";
import UserAvatar from "../../../components/ui/UserAvatar";

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
  const [show_course_content, setShowCourseContent] = useState(false);
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

          <div className="col-span-12 sm:col-span-6 md:col-span-7 lg:col-span-9">
            <div className="custom-grid">
              <div className="col-span-12">
                <div className="title-wrap">
                  <h2>{course.course_name}</h2>
                  <RoleProvider roles={[2]}>
                    <div className="btn-wrap">
                      <Link href={'/dashboard/courses/edit/' + course.course_id} className="btn btn-outline-primary"><AiOutlineEdit /> <span>{intl.formatMessage({ id: "edit" })}</span></Link>
                    </div>
                  </RoleProvider>
                </div>
              </div>
              <div className="col-span-12 sm:hidden">
                <CourseCard course={course} lessons={lessons} getCourse={getCourse} getLessons={getLessons} setSubscribersModal={setSubscribersModal} />
              </div>
              <div className="col-span-12">
                <div className="flex flex-wrap gap-4 md:gap-8 items-center">
                  <div className="flex gap-4 md:gap-6 items-center">
                    <UserAvatar user_avatar={course.avatar} className={'w-20 h-20 p-1'} />
                    <div>
                      <p className="text-inactive mb-0 text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_author" })}:</p>
                      <p className="font-medium text-corp mb-0">{course.last_name} {course.first_name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-inactive mb-0 text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_category" })}:</p>
                    <p className="font-medium text-corp mb-0">{course.course_category_name}</p>
                  </div>
                  <div>
                    <p className="text-inactive mb-0 text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_language" })}:</p>
                    <p className="font-medium text-corp mb-0">{course.lang_name}</p>
                  </div>
                  <div>
                    <p className="text-inactive mb-0 text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_level" })}:</p>
                    <p className="font-medium text-corp mb-0">{course.level_type_name}</p>
                  </div>
                  <div>
                    <p className="text-inactive mb-0 text-sm">{intl.formatMessage({ id: "rating" })}:</p>
                    <RatingStars className={'text-xl'} rating={course.rating} reviewers_count={course.reviewers_count} />
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <h3>{intl.formatMessage({ id: "page.my_courses.form.course_description" })}</h3>
                <p className="font-medium">{course.course_description}</p>
              </div>

              <div className={"col-span-12 course-content " + (show_course_content === false ? "hide" : "")}>
                <div className="custom-grid">
                  <div className="col-span-12">
                    <h3>{intl.formatMessage({ id: "page.my_courses.form.course_content" })}</h3>
                    {parse(course.course_content)}
                  </div>

                  {course.suitables?.length > 0 &&
                    <div className="col-span-12">
                      <h3>{intl.formatMessage({ id: "page.my_courses.form.who_is_suitable_for_this_course" })}</h3>
                      <div className="badge-wrap">
                        {course.suitables?.map(suitable => (
                          <div key={suitable.item_id} className="badge badge-outline-primary">
                            {suitable.item_value}
                          </div>
                        ))}
                      </div>
                    </div>
                  }

                  {course.skills?.length > 0 &&
                    <div className="col-span-12">
                      <h3>{intl.formatMessage({ id: "page.my_courses.form.what_skills_will_this_course_provide" })}</h3>
                      <div className="badge-wrap">
                        {course.skills?.map(skill => (
                          <div key={skill.item_id} className="badge badge-outline-primary">
                            {skill.item_value}
                          </div>
                        ))}
                      </div>
                    </div>
                  }

                  {course.requirements?.length > 0 &&
                    <div className="col-span-12">
                      <h3>{intl.formatMessage({ id: "page.my_courses.form.what_are_the_requirements_of_this_course" })}</h3>
                      <div className="badge-wrap">
                        {course.requirements?.map(requirement => (
                          <div key={requirement.item_id} className="badge badge-outline-primary">
                            {requirement.item_value}
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div className={"col-span-12 " + (show_course_content === false && "-mt-4")}>
                <button onClick={e => setShowCourseContent(!show_course_content)} className="flex items-center gap-1 text-corp border-corp border-b border-dashed pb-1">
                  {
                    show_course_content === false
                      ?
                      <>
                        <AiOutlinePlusCircle className="text-xl" /> <span>{intl.formatMessage({ id: "page.my_courses.form.show_course_content" })}</span>
                      </>
                      :
                      <>
                        <AiOutlineMinusCircle className="text-xl" /> <span>{intl.formatMessage({ id: "page.my_courses.form.hide_course_content" })}</span>
                      </>
                  }
                </button>
              </div>

              {course.subscribed == true &&
                <>
                  <div className="col-span-12">
                    <div className="title-wrap">
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
                  {
                    course.reviews?.length > 0 &&
                    <div className="col-span-12">
                      <ReviewsList items={course.reviews} rating={course.rating} reviewers_count={course.reviewers_count} />
                    </div>
                  }
                  {course.my_review == false
                    ?
                    <div className="col-span-12">
                      <ReviewForm
                        title={intl.formatMessage({ id: "leave_a_review_and_rating" })}
                        description={intl.formatMessage({ id: "page.my_courses.form.how_much_did_you_like_the_course" })}
                        url={'/courses/create_review/' + course.course_id} />
                    </div>
                    :
                    null
                  }
                </>
              }
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-5 max-sm:hidden lg:col-span-3">
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