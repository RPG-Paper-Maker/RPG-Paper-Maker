/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDLABEL_H
#define DIALOGCOMMANDLABEL_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandLabel
//
//  A dialog used for adding a label.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandLabel;
}

class DialogCommandLabel : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandLabel(bool jump, EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandLabel();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;
    bool m_isJump;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandLabel *ui;

    void translate();
};

#endif // DIALOGCOMMANDLABEL_H
