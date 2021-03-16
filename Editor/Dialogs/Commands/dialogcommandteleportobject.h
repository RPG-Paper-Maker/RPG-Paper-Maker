/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
        QStandardItemModel *properties = nullptr, QStandardItemModel
        *parameters = nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandTeleportObject();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandTeleportObject *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_modelObjects;
};

#endif // DIALOGTELEPORTOBJECT_H
