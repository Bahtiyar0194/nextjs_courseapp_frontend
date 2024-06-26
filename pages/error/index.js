import ErrorLayout from "../../components/layouts/ErrorLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIntl } from "react-intl";

export default function PageNumError() {
    const intl = useIntl();
    const router = useRouter();

    const { status, message, url } = router.query;
    const [show_message, setShowMessage] = useState(false);

    return (
        <ErrorLayout title={status > 0 ? intl.formatMessage({ id: "page.error." + status }) : intl.formatMessage({ id: "page.error.server_lost" })}>
            <div className="text-center">
                {status > 0
                    ?
                    <>
                        <h1 className="mb-2 text-6xl">{status}</h1>
                        <p className="text-active text-lg">
                            {
                                intl.formatMessage({ id: "page.error." + status })
                            }
                        </p>
                    </>
                    :
                    <h4 className="mb-2 text-3xl">{intl.formatMessage({ id: "page.error.server_lost" })}</h4>
                }
                {message &&
                    <>
                        {show_message == true &&
                            <div className="w-full overflow-hidden bg-inactive p-4 text-justify rounded-md mb-4">
                                <p className="break-all">{message}</p>
                                {url && <p className="text-danger break-all">{url}</p>}
                            </div>
                        }
                    </>
                }

                <div className="flex gap-4 justify-center max-md:flex-wrap">
                    {message && <button className="btn btn-light" onClick={e => setShowMessage(!show_message)}>{show_message === true ? intl.formatMessage({ id: "hide_error" }) : intl.formatMessage({ id: "show_error" })}</button>}
                    {status != 400 && <Link className="btn btn-outline-primary" href={'/'}>{intl.formatMessage({ id: "page.home.to" })}</Link>}
                </div>
            </div>
        </ErrorLayout>
    );
}