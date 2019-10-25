/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSETMOVETURNAPICTURE_H
#define DIALOGCOMMANDSETMOVETURNAPICTURE_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandSetMoveTurnAPicture
//
//  A dialog used for setting/moving/turning a displayed picture on screen.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandSetMoveTurnAPicture;
}

class DialogCommandSetMoveTurnAPicture : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandSetMoveTurnAPicture(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandSetMoveTurnAPicture();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;
    SuperListItem *m_pictureID;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandSetMoveTurnAPicture *ui;

public slots:
    void on_checkBoxSet_toggled(bool checked);
    void on_checkBoxMove_toggled(bool checked);
    void on_checkBoxTurn_toggled(bool checked);
    void on_checkBoxImageID_toggled(bool checked);
    void on_checkBoxZoom_toggled(bool checked);
    void on_checkBoxOpacity_toggled(bool checked);
    void on_checkBoxX_toggled(bool checked);
    void on_checkBoxY_toggled(bool checked);
    void on_checkBoxAngle_toggled(bool checked);
};

#endif // DIALOGCOMMANDSETMOVETURN_H
