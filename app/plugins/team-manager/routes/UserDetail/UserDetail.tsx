import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncRetry } from "react-use";
import * as R from "ramda";
import { useNavigate, useParams } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tag } from "antd";

import useStrapi from "~/hooks/useStrapi";
import useSession from "~/hooks/useSession";
import Spinner from "~/ui/Spinner";

import DeleteUser from "./DeleteUser";

export default function UserDetail() {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const { user } = useSession();
  const navigate = useNavigate();
  const { id } = useParams();
  const [remove, setRemove] = useState(false);
  const isYou = user?.id === Number(id);
  const canUpdate = permissions.some(
    R.whereEq({ action: "admin::users.update" })
  );
  const canDelete = permissions.some(
    R.whereEq({ action: "admin::users.delete" })
  );

  const { value, loading } = useAsyncRetry(async () => {
    if (id) {
      return await sdk.getAdminUser(Number(id));
    }
  }, [sdk, id]);

  return value ? (
    <>
      {remove && (
        <DeleteUser
          user={value}
          onClose={() => setRemove(false)}
          onDelete={() => {
            navigate("/team");
          }}
        />
      )}
      <div className="px-4 md:px-12">
        <div className="flex items-start justify-between my-12 pb-6">
          <div>
            <div className="mt-0 mb-4 flex items-center gap-4">
              <h1 className="m-0">{`${value.firstname} ${value.lastname}`}</h1>
              {isYou && (
                <Tag bordered={false} color="green">
                  {t("team.this_is_you")}
                </Tag>
              )}
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

          <div className="space-x-2">
            {canUpdate && <Button>{t("common.edit")}</Button>}
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
      </div>
    </>
  ) : (
    <div className="text-center py-12">
      <Spinner />
    </div>
  );
}
