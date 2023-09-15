import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncRetry } from "react-use";
import * as R from "ramda";
import { Link, useNavigate, useParams } from "react-router-dom";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tag } from "antd";

import useStrapi from "@/hooks/useStrapi";
import useSession from "@/hooks/useSession";
import Spinner from "@/ui/Spinner";

import DeleteUserModal from "./DeleteUserModal";
import UpdateUserModal from "./UpdateUserModal";

export default function UserDetail() {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const { user } = useSession();
  const navigate = useNavigate();
  const { id } = useParams();
  const [remove, setRemove] = useState(false);
  const [edit, setEdit] = useState(false);
  const isYou = user?.id === Number(id);
  const canUpdate = permissions.some(
    R.whereEq({ action: "admin::users.update" }),
  );
  const canDelete = permissions.some(
    R.whereEq({ action: "admin::users.delete" }),
  );

  const { value, retry } = useAsyncRetry(async () => {
    if (id) {
      return await sdk.getAdminUser(Number(id));
    }
  }, [sdk, id]);

  return value ? (
    <>
      {remove && (
        <DeleteUserModal
          user={value}
          onClose={() => setRemove(false)}
          onDelete={() => {
            navigate("/team");
          }}
        />
      )}
      {edit && (
        <UpdateUserModal
          user={value}
          onClose={() => setEdit(false)}
          onUpdate={() => {
            setEdit(false);
            retry();
          }}
        />
      )}
      <div className="px-4 md:px-12">
        <div className="my-12">
          <div className="mb-4">
            <Link to="/team" className="no-underline text-sm text-indigo-500">
              <FontAwesomeIcon icon={faArrowLeft} /> {t("common.back")}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="mt-0 mb-4 flex items-center gap-4">
              <h1 className="m-0">{`${value.firstname} ${value.lastname}`}</h1>
              {isYou && (
                <Tag bordered={false} color="green">
                  {t("team.this_is_you")}
                </Tag>
              )}
            </div>
            <div className="space-x-2">
              {canUpdate && (
                <Button onClick={() => setEdit(true)}>
                  {t("common.edit")}
                </Button>
              )}
              {canDelete && !isYou && (
                <Button
                  type="text"
                  danger
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  onClick={() => setRemove(true)}
                />
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">{value.email}</div>
          <div className="text-sm text-gray-600">
            {value.roles.map((role) => (
              <Tag key={role.id} color="geekblue" bordered={false}>
                {role.name}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="text-center py-12">
      <Spinner />
    </div>
  );
}
