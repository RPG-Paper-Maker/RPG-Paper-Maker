/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGESTATUS_H
#define DIALOGCOMMANDCHANGESTATUS_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandChangeStatus;
}

class DialogCommandChangeStatus : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeStatus(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandChangeStatus();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeStatus *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
};

#endif // DIALOGCOMMANDCHANGESTATUS_H
