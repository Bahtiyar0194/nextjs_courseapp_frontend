import Link from "next/link";
const DiskSpace = ({ intl, disk_data }) => {
    return (
        <Link className="text-active" href={'/dashboard/disk'}>
            <div className="p-2 bg-inactive border-active rounded-lg min-w-full w-60 mt-4">
                <div className="flex justify-between">
                    <p className="m-0">{intl.formatMessage({ id: "subscription_plan.disk_space" })}:</p>
                    <p className="m-0">{disk_data.disk_space_gb?.toFixed()} {intl.formatMessage({ id: "gigabyte" })}</p>
                </div>
                <div className="progress success sm">
                    <div className="progress-bar danger" style={{ 'width': disk_data.used_space_percent?.toFixed() + '%' }}></div>
                </div>
                <div className="flex justify-between">
                    <p className="text-xs text-success m-0">{intl.formatMessage({ id: "free_space" })}: <span className="text-active">{disk_data.free_space_gb?.toFixed(2)} {intl.formatMessage({ id: "gigabyte" })}</span></p>
                    <p className="text-xs text-inactive m-0">{disk_data.free_space_percent?.toFixed()}%</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-xs text-danger m-0">{intl.formatMessage({ id: "used_space" })}: <span className="text-active">{disk_data.used_space_gb?.toFixed(2)} {intl.formatMessage({ id: "gigabyte" })}</span></p>
                    <p className="text-xs text-inactive m-0">{disk_data.used_space_percent?.toFixed()}%</p>
                </div>
            </div>
        </Link>
    );
};

export default DiskSpace;