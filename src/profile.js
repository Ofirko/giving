return (
    <div>
        <ProfilePic
            image={this.props.image}
            showUploader={this.props.ShowUploader}
        />
        <BioEditor bio={this.props.bio} />
    </div>
);
