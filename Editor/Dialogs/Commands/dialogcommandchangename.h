/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGENAME_H
#define DIALOGCOMMANDCHANGENAME_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeName
//
//  A dialog used for changing name of an allie / enemy.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeName;
}

class DialogCommandChangeName : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeName(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandChangeName();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;

    void initializePrimitives();
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeName *ui;

    void translate();
};

#endif // DIALOGCOMMANDCHANGENAME_H
