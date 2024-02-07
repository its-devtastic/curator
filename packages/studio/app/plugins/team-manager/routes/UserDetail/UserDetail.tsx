import { Badge, Button } from "@curatorjs/ui";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowLeft, PiTrash } from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAsyncRetry } from "react-use";

import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";
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
      <div className="px-4 md:px-12">
        <div className="my-12">
          <div className="mb-4">
            <Link
              to="/team"
              className="no-underline text-sm flex items-center gap-2"
            >
              <PiArrowLeft /> {t("common.back")}
            </Link>
          </div>
          <div className="flex items-center justify-between border-b mb-4 pb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{`${value.firstname} ${value.lastname}`}</h1>
              {isYou && (
                <Badge variant="success">{t("team.this_is_you")}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {canUpdate && (
                <UpdateUserModal user={value}>
                  <Button variant="outline">{t("common.edit")}</Button>
                </UpdateUserModal>
              )}
              {canDelete && !isYou && (
                <Button variant="destructive" onClick={() => setRemove(true)}>
                  <PiTrash />
                </Button>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            {value.email}
          </div>
          <div className="space-x-2">
            {value.roles.map((role) => (
              <Badge key={role.id} variant="outline">
                {role.name}
              </Badge>
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
