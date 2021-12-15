/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSWITCHTEXTURE_H
#define DIALOGCOMMANDSWITCHTEXTURE_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandSwitchTexture;
}

class DialogCommandSwitchTexture : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandSwitchTexture(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandSwitchTexture();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandSwitchTexture *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
};

#endif // DIALOGCOMMANDSWITCHTEXTURE_H
