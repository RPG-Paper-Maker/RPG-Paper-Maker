/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEMONEY_H
#define DIALOGCOMMANDCHANGEMONEY_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandModifyMoney
//
//  A dialog used for changing money.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeMoney;
}

class DialogCommandChangeMoney : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeMoney(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandChangeMoney();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void initializePrimitives();
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeMoney *ui;

    void translate();
};

#endif // DIALOGCOMMANDCHANGEMONEY_H
