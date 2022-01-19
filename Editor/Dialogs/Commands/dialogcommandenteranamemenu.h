/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDENTERANAMEMENU_H
#define DIALOGCOMMANDENTERANAMEMENU_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandEnterANameMenu
//
//  A dialog used for command enter a name menu.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandEnterANameMenu;
}

class DialogCommandEnterANameMenu : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandEnterANameMenu(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandEnterANameMenu();

    void translate();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void initializePrimitives();

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandEnterANameMenu *ui;
};

#endif // DIALOGCOMMANDENTERANAMEMENU_H
