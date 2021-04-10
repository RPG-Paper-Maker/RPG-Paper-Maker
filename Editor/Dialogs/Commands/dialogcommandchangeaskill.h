/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEASKILL_H
#define DIALOGCOMMANDCHANGEASKILL_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeASkill
//
//  A dialog used for adding / removing a skill from an user.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeASkill;
}

class DialogCommandChangeASkill : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeASkill(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandChangeASkill();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void initializePrimitives();
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeASkill *ui;

    void translate();
};

#endif // DIALOGCOMMANDCHANGEASKILL_H
