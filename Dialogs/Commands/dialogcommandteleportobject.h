/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGCOMMANDTELEPORTOBJECT_H
#define DIALOGCOMMANDTELEPORTOBJECT_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandTeleportObject
//
//  A dialog used for teleporting an object to a position.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandTeleportObject;
}

class DialogCommandTeleportObject : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandTeleportObject(EventCommand *command = nullptr,
                                         SystemCommonObject *object = nullptr,
                                         QStandardItemModel *parameters =
                                         nullptr,
                                         QWidget *parent = 0);
    virtual ~DialogCommandTeleportObject();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandTeleportObject *ui;
    QStandardItemModel* m_modelObjects;

private slots:
   void on_radioButtonSelect_toggled(bool checked);
   void on_radioButtonNumber_toggled(bool checked);
   void on_radioButtonObject_toggled(bool checked);
};

#endif // DIALOGTELEPORTOBJECT_H
