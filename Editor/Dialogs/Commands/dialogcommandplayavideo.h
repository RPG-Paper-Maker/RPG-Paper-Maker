/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDPLAYAVIDEO_H
#define DIALOGCOMMANDPLAYAVIDEO_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandPlayAVideo;
}

class DialogCommandPlayAVideo : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandPlayAVideo(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandPlayAVideo();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandPlayAVideo *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
};

#endif // DIALOGCOMMANDPLAYAVIDEO_H
