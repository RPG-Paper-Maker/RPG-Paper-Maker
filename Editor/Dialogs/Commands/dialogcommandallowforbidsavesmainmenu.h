/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDALLOWFORBIDSAVESMAINMENU_H
#define DIALOGCOMMANDALLOWFORBIDSAVESMAINMENU_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS AllowForbidSavesMainMenu
//
//  A dialog used for allowing or forbidding saves or main menu.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandAllowForbidSavesMainMenu;
}

class DialogCommandAllowForbidSavesMainMenu : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandAllowForbidSavesMainMenu(EventCommandKind kind,
        EventCommand *command = nullptr, QStandardItemModel *properties = nullptr,
        QStandardItemModel *parameters = nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandAllowForbidSavesMainMenu();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    EventCommandKind m_kind;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandAllowForbidSavesMainMenu *ui;

    void translate();
};

#endif // DIALOGCOMMANDALLOWFORBIDSAVESMAINMENU_H
